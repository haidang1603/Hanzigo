import os
import hashlib
import json
import urllib.request
from pypdf import PdfReader
import io

SUPABASE_URL = "https://woszblniatdvijwdkmpm.supabase.co"
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

# Load .env if not set
if not SUPABASE_KEY and os.path.exists(".env"):
    with open(".env", "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("SUPABASE_SERVICE_ROLE_KEY="):
                SUPABASE_KEY = line.strip().split("=", 1)[1].strip('"').strip("'")
            elif line.startswith("VITE_SUPABASE_URL=") and not SUPABASE_URL:
                SUPABASE_URL = line.strip().split("=", 1)[1].strip('"').strip("'")

def get_materials_and_audit():
    # 1. Fetch materials metadata
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/materials?select=id,title,storage_bucket,storage_path,file_size_bytes,mime_type,level,category&order=id.asc",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }
    )
    with urllib.request.urlopen(req) as resp:
        materials = json.loads(resp.read().decode("utf-8"))

    print(f"Auditing {len(materials)} materials from Supabase Storage...\n")

    results = []

    for mat in materials:
        mat_id = mat["id"]
        storage_path = mat["storage_path"]
        
        # Request Signed URL
        sign_payload = json.dumps({"expiresIn": 300}).encode("utf-8")
        sign_req = urllib.request.Request(
            f"{SUPABASE_URL}/storage/v1/object/sign/materials/{storage_path}",
            data=sign_payload,
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json"
            }
        )
        
        with urllib.request.urlopen(sign_req) as s_resp:
            sign_data = json.loads(s_resp.read().decode("utf-8"))
            signed_url_path = sign_data.get("signedURL") or sign_data.get("signedUrl")
            signed_url = f"{SUPABASE_URL}/storage/v1{signed_url_path}"

        # Download Binary
        with urllib.request.urlopen(signed_url) as d_resp:
            content = d_resp.read()
            http_status = d_resp.status
            content_type = d_resp.headers.get("Content-Type")

        byte_size = len(content)
        sha256 = hashlib.sha256(content).hexdigest()
        is_pdf_sig = content.startswith(b"%PDF-")

        # Parse with pypdf
        extracted_text = ""
        page_count = 0
        is_corrupt = False
        try:
            reader = PdfReader(io.BytesIO(content))
            page_count = len(reader.pages)
            for p in reader.pages:
                extracted_text += p.extract_text() or ""
        except Exception as e:
            is_corrupt = True
            extracted_text = str(e)

        # Authenticity Classification
        # If it is only 1 page and < 5000 bytes with outline text, classify as PLACEHOLDER / SYLLABUS OUTLINE
        is_placeholder = (page_count <= 1 and byte_size < 10000)
        status_label = "PLACEHOLDER / SYLLABUS OUTLINE" if is_placeholder else "FULL PRODUCTION DOCUMENT"

        res = {
            "id": mat_id,
            "title": mat["title"],
            "storage_path": storage_path,
            "byte_size": byte_size,
            "sha256": sha256,
            "http_status": http_status,
            "content_type": content_type,
            "is_pdf_sig": is_pdf_sig,
            "page_count": page_count,
            "text_length": len(extracted_text.strip()),
            "status_label": status_label,
            "sample_snippet": extracted_text.strip().replace("\n", " ")[:160]
        }
        results.append(res)
        print(f"[{mat_id}] {status_label} | Pages: {page_count} | Size: {byte_size} B | SHA256: {sha256[:12]}...")
        print(f"       Snippet: \"{res['sample_snippet']}\"\n")

    with open("scripts/pdf_audit_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print("Audit finished. Results written to scripts/pdf_audit_results.json")

if __name__ == "__main__":
    get_materials_and_audit()

