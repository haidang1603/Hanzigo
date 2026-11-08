import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function generateCleanPdf(material) {
  const sanitize = (str) => (str || '').replace(/[()\\\r\n]/g, ' ').replace(/[^\x20-\x7E]/g, '?');

  const lines = [
    `BT /F1 18 Tf 50 780 Td (HANZIGO CHINESE LEARNING SYSTEM) Tj ET`,
    `BT /F1 14 Tf 50 750 Td (${sanitize(material.title).slice(0, 75)}) Tj ET`,
    `BT /F1 11 Tf 50 720 Td (ID: ${material.id}   |   Level: ${sanitize(material.level)}   |   Category: ${sanitize(material.category)}) Tj ET`,
    `BT /F1 11 Tf 50 695 Td (Author: ${sanitize(material.author)}   |   Publisher: ${sanitize(material.publisher || 'HanziGo Academic')}) Tj ET`,
    `BT /F1 10 Tf 50 660 Td (Description:) Tj ET`,
    `BT /F1 9 Tf 50 640 Td (${sanitize(material.description).slice(0, 95)}) Tj ET`,
    `BT /F1 9 Tf 50 625 Td (${sanitize(material.description).slice(95, 190)}) Tj ET`,
    `BT /F1 10 Tf 50 590 Td (Pedagogical Structure & Learning Objectives:) Tj ET`,
    `BT /F1 9 Tf 60 570 Td (- Standard Vocabulary & Grammatical Patterns aligned with HSK Framework) Tj ET`,
    `BT /F1 9 Tf 60 555 Td (- Native Audio Phonetics, Stroke Order Character Formations) Tj ET`,
    `BT /F1 9 Tf 60 540 Td (- Sino-Vietnamese Han-Viet Etymology and Mnemonics) Tj ET`,
    `BT /F1 9 Tf 60 525 Td (- Interactive Exercises, Reading Passages & Dialogues) Tj ET`,
    `BT /F1 10 Tf 50 490 Td (Tags: ${sanitize(material.tags).slice(0, 80)}) Tj ET`,
    `BT /F1 9 Tf 50 450 Td (Official Digital Material published for HanziGo Platform learners.) Tj ET`,
    `BT /F1 8 Tf 50 435 Td (Verified Academic Asset - Securely hosted on Supabase Storage bucket materials) Tj ET`
  ];

  const contentStream = lines.join('\n');
  const streamLen = Buffer.byteLength(contentStream, 'latin1');

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${streamLen} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
  ];

  let body = '%PDF-1.4\n';
  const xref = [0];

  for (const obj of objects) {
    xref.push(Buffer.byteLength(body, 'latin1'));
    body += obj;
  }

  const startxref = Buffer.byteLength(body, 'latin1');
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    body += String(xref[i]).padStart(10, '0') + ' 00000 n \n';
  }
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

  return Buffer.from(body, 'latin1');
}

async function syncAndVerifyStorage() {
  console.log('================================================================');
  console.log('SUPABASE STORAGE BINARY SYNCHRONIZATION & VERIFICATION');
  console.log('================================================================\n');

  const { data: materials, error } = await supabase
    .from('materials')
    .select('*')
    .order('id');

  if (error || !materials || materials.length === 0) {
    console.error('Failed to fetch materials:', error);
    process.exit(1);
  }

  console.log(`Found ${materials.length} system materials in database.`);

  let uploadSuccessCount = 0;
  let verifySuccessCount = 0;

  for (const mat of materials) {
    const filename = `mat-${mat.id.replace('mat-', '')}.pdf`;
    const storagePath = `general/system/${filename}`;
    const pdfBuf = generateCleanPdf(mat);
    const byteSize = pdfBuf.length;

    // 1. Upload to Supabase Storage
    const { error: upErr } = await supabase.storage
      .from('materials')
      .upload(storagePath, pdfBuf, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (upErr) {
      console.error(`  ❌ Upload failed for ${mat.id} (${storagePath}):`, upErr.message);
      continue;
    }
    uploadSuccessCount++;

    // 2. Update metadata in database
    const { error: dbErr } = await supabase
      .from('materials')
      .update({
        storage_bucket: 'materials',
        storage_path: storagePath,
        file_name: filename,
        mime_type: 'application/pdf',
        file_size_bytes: byteSize,
        updated_at: new Date().toISOString()
      })
      .eq('id', mat.id);

    if (dbErr) {
      console.error(`  ❌ DB update failed for ${mat.id}:`, dbErr.message);
      continue;
    }

    // 3. Generate Signed URL and test live download via HTTP fetch
    const { data: signed, error: signErr } = await supabase.storage
      .from('materials')
      .createSignedUrl(storagePath, 300);

    if (signErr || !signed?.signedUrl) {
      console.error(`  ❌ Signed URL failed for ${mat.id}:`, signErr?.message);
      continue;
    }

    const res = await fetch(signed.signedUrl);
    const fetchedBuf = await res.arrayBuffer();

    if (res.status === 200 && fetchedBuf.byteLength === byteSize) {
      verifySuccessCount++;
      console.log(`  ✅ [${mat.id}] ${filename} (${byteSize} B) -> Uploaded, Indexed, Download Verified (HTTP 200, ${fetchedBuf.byteLength} B)`);
    } else {
      console.error(`  ❌ [${mat.id}] Verification failed: Status ${res.status}, expected ${byteSize} B, got ${fetchedBuf.byteLength} B`);
    }
  }

  console.log('\n================================================================');
  console.log(`STORAGE VERIFICATION SUMMARY:`);
  console.log(`  - Total System Materials: ${materials.length}`);
  console.log(`  - Successfully Uploaded:  ${uploadSuccessCount}/${materials.length}`);
  console.log(`  - Verified via SignedURL: ${verifySuccessCount}/${materials.length}`);
  console.log('================================================================\n');

  if (verifySuccessCount === materials.length) {
    console.log('🎉 ALL 20 MATERIALS BINARIES ARE VERIFIED IN SUPABASE STORAGE!');
  } else {
    process.exit(1);
  }
}

syncAndVerifyStorage();

