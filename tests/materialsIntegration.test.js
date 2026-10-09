import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Polyfill localStorage in Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

import { 
  DEFAULT_MATERIALS,
  CURRENT_MATERIALS_VERSION,
  MATERIAL_CATEGORIES,
  MATERIAL_LEVELS,
  MATERIAL_SKILLS,
  MATERIAL_FORMATS,
  VERIFICATION_STATUS_META,
  getStoredMaterials,
  saveMaterial,
  updateMaterial,
  deleteMaterial,
  resetMaterials
} from '../src/utils/materialsStorage.js';

import {
  getMaterialsFromDb,
  getMaterialsForLesson,
  addMaterialToDb,
  updateMaterialInDb
} from '../src/services/materialsService.js';

test('1. DATA INTEGRITY: DEFAULT_MATERIALS contains 20 verified learning resources', () => {
  assert.equal(DEFAULT_MATERIALS.length, 20, 'Should have exactly 20 verified default materials');
  assert.equal(CURRENT_MATERIALS_VERSION, 'v2.1_academic', 'Version should match academic release');
});

test('2. REQUIRED METADATA FIELDS: Every material must satisfy all Task 4 data requirements', () => {
  const requiredStatuses = ['verified_official', 'verified_oer', 'academic_reference', 'curated'];

  DEFAULT_MATERIALS.forEach((mat, idx) => {
    assert.ok(mat.id, `Item #${idx} must have an id`);
    assert.ok(mat.title && mat.title.trim().length > 5, `Item #${idx} (${mat.title}) must have a valid title`);
    assert.ok(mat.description && mat.description.trim().length > 10, `Item #${idx} must have description`);
    assert.ok(mat.sourceUrl && mat.sourceUrl.startsWith('http') || mat.sourceUrl.startsWith('/'), `Item #${idx} must have valid sourceUrl`);
    assert.ok(mat.downloadUrl, `Item #${idx} must have downloadUrl`);
    assert.ok(mat.publisher, `Item #${idx} (${mat.title}) must specify publisher`);
    assert.ok(mat.author, `Item #${idx} must specify author`);
    assert.ok(mat.level, `Item #${idx} must specify level`);
    assert.ok(mat.category, `Item #${idx} must specify category`);
    assert.ok(mat.format, `Item #${idx} must specify format`);
    assert.ok(mat.language, `Item #${idx} must specify language`);
    assert.ok(mat.license, `Item #${idx} must specify license/access condition`);
    assert.ok(requiredStatuses.includes(mat.verificationStatus), `Item #${idx} verificationStatus must be valid`);
    assert.ok(Array.isArray(mat.skills) && mat.skills.length > 0, `Item #${idx} must have skills array`);
    assert.ok(mat.relatedLessonId, `Item #${idx} must link to a curriculum module/lesson`);
  });
});

test('3. VERIFICATION BADGES & SKILLS: Verification metadata and skills taxonomy are consistent', () => {
  assert.ok(VERIFICATION_STATUS_META.verified_official, 'verified_official meta should exist');
  assert.ok(VERIFICATION_STATUS_META.verified_oer, 'verified_oer meta should exist');
  assert.ok(VERIFICATION_STATUS_META.academic_reference, 'academic_reference meta should exist');
  assert.ok(VERIFICATION_STATUS_META.curated, 'curated meta should exist');

  Object.values(VERIFICATION_STATUS_META).forEach(meta => {
    assert.ok(meta.label, 'Meta must have a label');
    assert.ok(meta.badgeClass, 'Meta must have badgeClass');
    assert.ok(meta.icon, 'Meta must have icon');
  });

  assert.ok(MATERIAL_SKILLS.includes('Tất cả kỹ năng'));
  assert.ok(MATERIAL_SKILLS.includes('Nghe hiểu'));
  assert.ok(MATERIAL_SKILLS.includes('Nói & Khẩu ngữ'));
  assert.ok(MATERIAL_SKILLS.includes('Đọc hiểu'));
  assert.ok(MATERIAL_SKILLS.includes('Viết & Thuận bút'));
  assert.ok(MATERIAL_SKILLS.includes('Ngữ pháp'));
  assert.ok(MATERIAL_SKILLS.includes('Từ vựng'));
  assert.ok(MATERIAL_SKILLS.includes('Luyện thi HSK'));
});

test('4. STORAGE & MIGRATION: Handles auto-migration and CRUD operations cleanly', () => {
  localStorage.clear();

  // Initial load auto-migrates to default academic materials
  const initial = getStoredMaterials();
  assert.equal(initial.length, 20);
  assert.equal(localStorage.getItem('hanzigo_materials_version'), 'v2.1_academic');

  // Add custom material
  const testItem = {
    id: 'mat-test-unit-1',
    title: 'Tài liệu Thử Nghiệm Kiểm Tra Unit',
    category: 'Giáo trình chuẩn',
    level: 'HSK 1',
    skills: ['Từ vựng', 'Ngữ pháp'],
    publisher: 'HanziGo Test Unit',
    author: 'Tester',
    format: 'PDF',
    language: 'Song ngữ Trung - Việt',
    license: 'Giáo dục Mở',
    verificationStatus: 'curated',
    relatedLessonId: 'Module 1.1',
    downloadUrl: 'https://example.com/test.pdf',
    sourceUrl: 'https://example.com/test',
    description: 'Tài liệu dùng cho kiểm thử tự động hệ thống.',
    tags: ['Test', 'HSK 1']
  };

  const afterSave = saveMaterial(testItem);
  assert.ok(afterSave.some(m => m.id === 'mat-test-unit-1'), 'Custom item should be saved');

  // Update custom material
  const afterUpdate = updateMaterial('mat-test-unit-1', { title: 'Tài liệu Thử Nghiệm Đã Đổi Tên' });
  const updatedItem = afterUpdate.find(m => m.id === 'mat-test-unit-1');
  assert.equal(updatedItem.title, 'Tài liệu Thử Nghiệm Đã Đổi Tên');

  // Delete custom material
  const afterDelete = deleteMaterial('mat-test-unit-1');
  assert.ok(!afterDelete.some(m => m.id === 'mat-test-unit-1'), 'Custom item should be deleted');
});

test('5. CURRICULUM LESSON FILTERING: getMaterialsForLesson finds relevant materials', async () => {
  // Test finding materials matching Module 1.1 / Lesson 101
  const hsk1Materials = await getMaterialsForLesson('Module 1.1');
  assert.ok(hsk1Materials.length > 0, 'Should find at least 1 material for Module 1.1');

  // Test finding materials matching Module 3.1
  const hsk3Materials = await getMaterialsForLesson('Module 3.1');
  assert.ok(hsk3Materials.length > 0, 'Should find materials for Module 3.1');
});

test('6. DATABASE MIGRATION 14 & RLS: Migration file exists and defines new metadata schema', () => {
  const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/14_materials_metadata_and_skills.sql');
  assert.ok(fs.existsSync(migrationPath), 'Migration 14 file must exist');

  const content = fs.readFileSync(migrationPath, 'utf8');
  assert.ok(content.includes('ADD COLUMN IF NOT EXISTS source_url'), 'Must add source_url column');
  assert.ok(content.includes('ADD COLUMN IF NOT EXISTS publisher'), 'Must add publisher column');
  assert.ok(content.includes('ADD COLUMN IF NOT EXISTS skills'), 'Must add skills column');
  assert.ok(content.includes('ADD COLUMN IF NOT EXISTS language'), 'Must add language column');
  assert.ok(content.includes('ADD COLUMN IF NOT EXISTS license'), 'Must add license column');
  assert.ok(content.includes('ADD COLUMN IF NOT EXISTS verification_status'), 'Must add verification_status column');
  assert.ok(content.includes('ADD COLUMN IF NOT EXISTS related_lesson_id'), 'Must add related_lesson_id column');
  assert.ok(content.includes('is_hidden = false'), 'RLS policy must restrict public view to non-hidden materials');
  assert.ok(content.includes('public.is_admin()'), 'RLS policy must grant full access to admins');
});
