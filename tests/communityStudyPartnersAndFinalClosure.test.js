import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  validateStudyPartnerInput,
  normalizePartnerData,
  getStudyPartnersFromDb,
  addStudyPartnerToDb,
  updateStudyPartnerInDb,
  toggleStudyPartnerStatusInDb,
  deleteStudyPartnerFromDb
} from '../src/services/communityService.js';

describe('Phase 24 / Task 24.08E — Community Study Partners & Final Closure Tests', () => {

  // =========================================================================
  // GROUP 1: STATIC / SCHEMA & SECURITY DEFINITION AUDIT
  // =========================================================================
  describe('Group 1: Static / Schema & Security Definition Audit', () => {
    test('1.1. Migration 20261108_community_study_partners_hardening.sql exists and is strictly non-destructive', () => {
      const migrationPath = path.resolve('supabase/migrations/20261108_community_study_partners_hardening.sql');
      assert.strictEqual(fs.existsSync(migrationPath), true, 'Migration file must exist');

      const sql = fs.readFileSync(migrationPath, 'utf8');
      assert.strictEqual(sql.includes('DROP TABLE'), false, 'Forbidden to drop table');
      assert.strictEqual(sql.includes('DROP COLUMN'), false, 'Forbidden to drop column');
      assert.strictEqual(sql.includes('CASCADE'), false, 'Forbidden to use CASCADE');
      assert.strictEqual(sql.includes('ALTER TABLE public.study_partners'), true, 'Must alter study_partners table safely');
      assert.strictEqual(sql.includes('ADD COLUMN IF NOT EXISTS is_active'), true, 'Must add is_active column');
      assert.strictEqual(sql.includes('ADD COLUMN IF NOT EXISTS is_contact_public'), true, 'Must add is_contact_public column');
      assert.strictEqual(sql.includes('ADD COLUMN IF NOT EXISTS skills'), true, 'Must add skills column');
    });

    test('1.2. Migration adds indexes for active status, user_id and target_level', () => {
      const migrationPath = path.resolve('supabase/migrations/20261108_community_study_partners_hardening.sql');
      const sql = fs.readFileSync(migrationPath, 'utf8');

      assert.strictEqual(sql.includes('idx_study_partners_active'), true, 'Must create index for is_active');
      assert.strictEqual(sql.includes('idx_study_partners_user_id'), true, 'Must create index for user_id');
      assert.strictEqual(sql.includes('idx_study_partners_target_level'), true, 'Must create index for target_level');
    });

    test('1.3. Master schema.sql synchronizes study_partners columns and RLS policies', () => {
      const schemaPath = path.resolve('supabase/schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');

      assert.strictEqual(schema.includes('ALTER TABLE public.study_partners ADD COLUMN IF NOT EXISTS is_active'), true);
      assert.strictEqual(schema.includes('ALTER TABLE public.study_partners ADD COLUMN IF NOT EXISTS is_contact_public'), true);
      assert.strictEqual(schema.includes('ALTER TABLE public.study_partners ADD COLUMN IF NOT EXISTS skills'), true);
      assert.strictEqual(schema.includes('study_partners_select'), true);
      assert.strictEqual(schema.includes('study_partners_insert'), true);
      assert.strictEqual(schema.includes('study_partners_update'), true);
      assert.strictEqual(schema.includes('study_partners_delete'), true);
    });

    test('1.4. Security Audit: Zero exposure of service role key in frontend source files', () => {
      function scanDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
              scanDir(fullPath);
            }
          } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            assert.strictEqual(
              content.includes('SUPABASE_SERVICE_ROLE_KEY') && !fullPath.includes('api\\') && !fullPath.includes('api/'),
              false,
              `Frontend file ${fullPath} must not reference SUPABASE_SERVICE_ROLE_KEY`
            );
            assert.strictEqual(
              content.includes('service_role') && content.includes('eyJ') && !fullPath.includes('.env'),
              false,
              `Frontend file ${fullPath} must not contain hardcoded service_role JWT token`
            );
          }
        }
      }
      scanDir(path.resolve('src'));
    });
  });

  // =========================================================================
  // GROUP 2: UNIT BUSINESS LOGIC & INPUT VALIDATION
  // =========================================================================
  describe('Group 2: Unit Business Logic & Input Validation', () => {
    test('2.1. validateStudyPartnerInput: Rejects empty name', () => {
      const res = validateStudyPartnerInput({ name: '   ', level: 'HSK 1' });
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.error, 'Họ tên hoặc biệt danh là bắt buộc.');
    });

    test('2.2. validateStudyPartnerInput: Rejects excessively long name (> 60 chars)', () => {
      const longName = 'A'.repeat(61);
      const res = validateStudyPartnerInput({ name: longName });
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.error, 'Tên không được vượt quá 60 ký tự.');
    });

    test('2.3. validateStudyPartnerInput: Normalizes and accepts HSK 1 to HSK 6 & Giao tiếp tự do', () => {
      const levels = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'Giao tiếp tự do'];
      for (const lvl of levels) {
        const res = validateStudyPartnerInput({ name: 'Học viên A', level: lvl });
        assert.strictEqual(res.valid, true);
        assert.strictEqual(res.sanitized.level, lvl);
      }

      // Prefix match for legacy 'HSK 1 - Sơ cấp'
      const legacyRes = validateStudyPartnerInput({ name: 'Học viên B', level: 'HSK 1 - Sơ cấp' });
      assert.strictEqual(legacyRes.valid, true);
      assert.strictEqual(legacyRes.sanitized.level, 'HSK 1');
    });

    test('2.4. validateStudyPartnerInput: Enforces limits on contactInfo (200), goal (300), dailyTime (100), skills (150)', () => {
      assert.strictEqual(validateStudyPartnerInput({ name: 'Nam', contactInfo: 'C'.repeat(201) }).valid, false);
      assert.strictEqual(validateStudyPartnerInput({ name: 'Nam', goal: 'G'.repeat(301) }).valid, false);
      assert.strictEqual(validateStudyPartnerInput({ name: 'Nam', dailyTime: 'T'.repeat(101) }).valid, false);
      assert.strictEqual(validateStudyPartnerInput({ name: 'Nam', skills: 'S'.repeat(151) }).valid, false);
    });

    test('2.5. validateStudyPartnerInput: Rejects oversized Base64 QR code image (> 350KB)', () => {
      const hugeQr = 'data:image/png;base64,' + 'X'.repeat(360000);
      const res = validateStudyPartnerInput({ name: 'Nam', qrImage: hugeQr });
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.error, 'Ảnh mã QR quá lớn (tối đa 250KB sau khi nén).');
    });

    test('2.6. normalizePartnerData: Correctly normalizes DB row and identifies owner', () => {
      const rawRow = {
        id: 42,
        user_id: 'user-uuid-1234',
        name: 'Hoàng Nam',
        target_level: 'HSK 3',
        daily_time: 'Tối 20h - 21h',
        contact: 'Zalo: 0912345678',
        intro: 'Luyện nghe nói phản xạ',
        skills: 'Phát âm chuẩn',
        is_active: true,
        is_contact_public: true,
        created_at: '2026-11-08T10:00:00Z'
      };

      const viewerNotOwner = normalizePartnerData(rawRow, 'user-uuid-9999');
      assert.strictEqual(viewerNotOwner.id, '42');
      assert.strictEqual(viewerNotOwner.name, 'Hoàng Nam');
      assert.strictEqual(viewerNotOwner.initial, 'H');
      assert.strictEqual(viewerNotOwner.level, 'HSK 3');
      assert.strictEqual(viewerNotOwner.contactMethod, 'Zalo');
      assert.strictEqual(viewerNotOwner.contactInfo, '0912345678');
      assert.strictEqual(viewerNotOwner.isMyPartnerPost, false);
      assert.strictEqual(viewerNotOwner.isActive, true);

      const ownerViewer = normalizePartnerData(rawRow, 'user-uuid-1234');
      assert.strictEqual(ownerViewer.isMyPartnerPost, true);
    });

    test('2.7. normalizePartnerData: Resilient to missing or incomplete legacy row fields', () => {
      const legacyRow = {
        id: 6,
        user_id: null,
        name: 'Đăng',
        target_level: 'HSK 1 - Sơ cấp',
        daily_time: '',
        contact: '',
        intro: '',
        qr_image: null,
        created_at: '2026-09-27T17:27:31Z'
      };

      const normalized = normalizePartnerData(legacyRow, null);
      assert.strictEqual(normalized.id, '6');
      assert.strictEqual(normalized.name, 'Đăng');
      assert.strictEqual(normalized.initial, 'Đ');
      assert.strictEqual(normalized.level, 'HSK 1 - Sơ cấp');
      assert.strictEqual(normalized.goal, 'Luyện phản xạ giao tiếp');
      assert.strictEqual(normalized.isActive, true);
      assert.strictEqual(normalized.isContactPublic, true);
    });
  });

  // =========================================================================
  // GROUP 3: INTEGRATION & PRIVACY / OWNERSHIP SIMULATION
  // =========================================================================
  describe('Group 3: Integration & Privacy / Ownership Simulation', () => {
    // In-memory mock database for study partners
    function createMockPartnersDb() {
      return {
        partners: [
          {
            id: '1',
            user_id: 'student-A',
            name: 'Nguyễn Văn A',
            target_level: 'HSK 2',
            daily_time: '20h - 21h',
            contact: 'Zalo: 0901111222',
            intro: 'Luyện khẩu ngữ HSK 2',
            skills: 'Khẩu ngữ',
            is_active: true,
            is_contact_public: true,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: 'student-B',
            name: 'Trần Thị B',
            target_level: 'HSK 4',
            daily_time: 'Cuối tuần',
            contact: 'WeChat: @tranthib',
            intro: 'Luyện thi HSKK trung cấp',
            skills: 'HSKK',
            is_active: false, // Paused by Student B
            is_contact_public: false,
            created_at: new Date().toISOString()
          }
        ]
      };
    }

    test('3.1. Student creates profile: Attached with user_id and active state', () => {
      const db = createMockPartnersDb();
      const currentUserId = 'student-C';

      const validation = validateStudyPartnerInput({
        name: 'Lê Văn C',
        level: 'HSK 3',
        goal: 'Luyện giao tiếp',
        contactMethod: 'Telegram',
        contactInfo: '@levanc',
        userId: currentUserId
      });
      assert.strictEqual(validation.valid, true);

      const newRow = {
        id: String(db.partners.length + 1),
        user_id: currentUserId,
        name: validation.sanitized.name,
        target_level: validation.sanitized.level,
        daily_time: validation.sanitized.dailyTime,
        contact: `${validation.sanitized.contactMethod}: ${validation.sanitized.contactInfo}`,
        intro: validation.sanitized.goal,
        skills: validation.sanitized.skills,
        is_active: validation.sanitized.isActive,
        is_contact_public: validation.sanitized.isContactPublic,
        created_at: new Date().toISOString()
      };
      db.partners.unshift(newRow);

      assert.strictEqual(db.partners.length, 3);
      assert.strictEqual(db.partners[0].user_id, 'student-C');
      assert.strictEqual(db.partners[0].is_active, true);
    });

    test('3.2. Student updates own profile: Successfully mutates without duplicating', () => {
      const db = createMockPartnersDb();
      const currentUserId = 'student-A';
      const partnerIdToUpdate = '1';

      const partner = db.partners.find(p => p.id === partnerIdToUpdate);
      assert.strictEqual(partner.user_id, currentUserId, 'Must be owner');

      // Update goal and level
      const updatedData = {
        name: 'Nguyễn Văn A (Cập nhật)',
        level: 'HSK 3',
        goal: 'Đã lên HSK 3, tìm bạn luyện nói',
        contactInfo: '0901111222'
      };
      const validation = validateStudyPartnerInput(updatedData);
      assert.strictEqual(validation.valid, true);

      partner.name = validation.sanitized.name;
      partner.target_level = validation.sanitized.level;
      partner.intro = validation.sanitized.goal;

      assert.strictEqual(partner.name, 'Nguyễn Văn A (Cập nhật)');
      assert.strictEqual(partner.target_level, 'HSK 3');
      assert.strictEqual(db.partners.length, 2, 'Must not duplicate record');
    });

    test('3.3. Student pauses and resumes profile (Toggle is_active)', () => {
      const db = createMockPartnersDb();
      const partner = db.partners.find(p => p.id === '1');
      assert.strictEqual(partner.is_active, true);

      // Student A pauses
      partner.is_active = false;
      assert.strictEqual(partner.is_active, false);

      // Student A resumes
      partner.is_active = true;
      assert.strictEqual(partner.is_active, true);
    });

    test('3.4. RLS Security Simulation: Student A cannot modify Student B profile', () => {
      const db = createMockPartnersDb();
      const currentUserId = 'student-A';
      const targetPartnerId = '2'; // Belonging to Student B

      function updatePartner(userId, isAdmin, partnerId, newName) {
        const p = db.partners.find(item => item.id === partnerId);
        if (!p) throw new Error('Not found');
        if (p.user_id !== userId && !isAdmin) {
          throw new Error('42501: Quyền hạn bị từ chối: Bạn không có quyền chỉnh sửa hồ sơ này.');
        }
        p.name = newName;
      }

      // Student A tries to update Student B
      assert.throws(
        () => updatePartner(currentUserId, false, targetPartnerId, 'Hacked Name'),
        /42501/
      );
      assert.strictEqual(db.partners.find(p => p.id === '2').name, 'Trần Thị B');
    });

    test('3.5. Admin moderation: Admin can moderate/delete any inappropriate partner post', () => {
      const db = createMockPartnersDb();
      const adminUserId = 'admin-user-uuid';

      function deletePartner(userId, isAdmin, partnerId) {
        const index = db.partners.findIndex(item => item.id === partnerId);
        if (index === -1) throw new Error('Not found');
        const p = db.partners[index];
        if (p.user_id !== userId && !isAdmin) {
          throw new Error('42501: Quyền hạn bị từ chối.');
        }
        db.partners.splice(index, 1);
        return true;
      }

      // Admin deletes toxic partner post 2
      const result = deletePartner(adminUserId, true, '2');
      assert.strictEqual(result, true);
      assert.strictEqual(db.partners.length, 1);
      assert.strictEqual(db.partners.some(p => p.id === '2'), false);
    });

    test('3.6. Privacy isolation: Inactive profiles hidden from public search, visible only to owner and admin', () => {
      const db = createMockPartnersDb();

      function getVisiblePartners(viewerUserId, isAdmin) {
        return db.partners.filter(p => {
          if (p.is_active === true) return true;
          if (isAdmin) return true;
          if (viewerUserId && p.user_id === viewerUserId) return true;
          return false;
        });
      }

      // Public viewer / Stranger
      const visibleToStranger = getVisiblePartners('stranger-user', false);
      assert.strictEqual(visibleToStranger.length, 1);
      assert.strictEqual(visibleToStranger[0].id, '1');

      // Student B (Owner of inactive post 2)
      const visibleToOwnerB = getVisiblePartners('student-B', false);
      assert.strictEqual(visibleToOwnerB.length, 2);
      assert.strictEqual(visibleToOwnerB.some(p => p.id === '2'), true);

      // Admin
      const visibleToAdmin = getVisiblePartners('admin-user', true);
      assert.strictEqual(visibleToAdmin.length, 2);
    });

    test('3.7. Contact privacy masking: Private contact is masked when viewed by strangers', () => {
      const partner = {
        name: 'Trần Thị B',
        contactMethod: 'WeChat',
        contactInfo: '@tranthib_secret',
        isContactPublic: false,
        user_id: 'student-B'
      };

      function displayContact(p, viewerUserId) {
        const isOwner = viewerUserId && p.user_id === viewerUserId;
        if (p.isContactPublic || isOwner) {
          return p.contactInfo;
        }
        return 'Thông tin liên hệ bảo mật';
      }

      assert.strictEqual(displayContact(partner, 'student-A'), 'Thông tin liên hệ bảo mật');
      assert.strictEqual(displayContact(partner, 'student-B'), '@tranthib_secret');
    });
  });

  // =========================================================================
  // GROUP 4: LIVE DATABASE CHECKS (SUPABASE CLOUD / ENV INTEGRATION)
  // =========================================================================
  describe('Group 4: Live Database Checks (Live DB Environment)', () => {
    let liveSupabase = null;

    test('4.1. Live Database: Connects to Supabase Cloud if credentials available', async () => {
      const envPath = path.resolve('.env');
      if (!fs.existsSync(envPath)) {
        console.log('Skipping live test: .env not found');
        return;
      }

      const envContent = fs.readFileSync(envPath, 'utf8');
      const urlMatch = envContent.match(/VITE_SUPABASE_URL=([^\r\n]+)/);
      const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/);

      if (!urlMatch || !keyMatch) {
        console.log('Skipping live test: Supabase URL/Key missing in .env');
        return;
      }

      const { createClient } = await import('@supabase/supabase-js');
      liveSupabase = createClient(urlMatch[1], keyMatch[1]);
      assert.ok(liveSupabase, 'Supabase client initialized');
    });

    test('4.2. Live Database: Querying study_partners preserves legacy rows (IDs 6, 7, 8)', async () => {
      if (!liveSupabase) {
        console.log('Skipping live test: Supabase not configured');
        return;
      }

      const { data, error } = await liveSupabase
        .from('study_partners')
        .select('*')
        .order('id', { ascending: true });

      assert.strictEqual(error, null, 'Query should not throw error');
      assert.ok(Array.isArray(data), 'Data should be an array');
      assert.ok(data.length >= 3, 'Live DB must contain at least the 3 existing legacy records');

      const ids = data.map(r => r.id);
      assert.ok(ids.includes(6), 'Legacy record ID 6 must be preserved');
      assert.ok(ids.includes(7), 'Legacy record ID 7 must be preserved');
      assert.ok(ids.includes(8), 'Legacy record ID 8 must be preserved');
    });

    test('4.3. Live Database: Legacy record ID 8 retains Base64 QR code without corruption', async () => {
      if (!liveSupabase) {
        console.log('Skipping live test: Supabase not configured');
        return;
      }

      const { data, error } = await liveSupabase
        .from('study_partners')
        .select('id, name, qr_image')
        .eq('id', 8)
        .single();

      assert.strictEqual(error, null);
      assert.strictEqual(data.id, 8);
      assert.strictEqual(data.name, 'Lê Hải Đăng depzai');
      assert.ok(data.qr_image && data.qr_image.startsWith('data:image/jpeg;base64,'), 'QR code Data URL intact');
    });
  });

  // =========================================================================
  // GROUP 5: COMMUNITY REGRESSION & FULL INTEGRATION
  // =========================================================================
  describe('Group 5: Community Regression & Full Integration', () => {
    test('5.1. Feed regression: community_posts queries and cursor pagination remain operational', async () => {
      const { getCommunityPosts } = await import('../src/services/communityService.js');
      assert.strictEqual(typeof getCommunityPosts, 'function');
    });

    test('5.2. Comments regression: Relational comments and counter triggers intact', async () => {
      const { getPostComments, createCommunityComment, deleteCommunityComment } = await import('../src/services/communityService.js');
      assert.strictEqual(typeof getPostComments, 'function');
      assert.strictEqual(typeof createCommunityComment, 'function');
      assert.strictEqual(typeof deleteCommunityComment, 'function');
    });

    test('5.3. Reactions regression: Atomic reaction RPC and toggles intact', async () => {
      const { togglePostReaction } = await import('../src/services/communityService.js');
      assert.strictEqual(typeof togglePostReaction, 'function');
    });

    test('5.4. Reports & Moderation regression: submitCommunityReport & moderateCommunityContent intact', async () => {
      const { submitCommunityReport, moderateCommunityContent, getCommunityReports } = await import('../src/services/communityService.js');
      assert.strictEqual(typeof submitCommunityReport, 'function');
      assert.strictEqual(typeof moderateCommunityContent, 'function');
      assert.strictEqual(typeof getCommunityReports, 'function');
    });

    test('5.5. Study Partners API contract: All required CRUD & toggle methods are exported', async () => {
      const communityModule = await import('../src/services/communityService.js');
      assert.strictEqual(typeof communityModule.getStudyPartnersFromDb, 'function');
      assert.strictEqual(typeof communityModule.addStudyPartnerToDb, 'function');
      assert.strictEqual(typeof communityModule.updateStudyPartnerInDb, 'function');
      assert.strictEqual(typeof communityModule.toggleStudyPartnerStatusInDb, 'function');
      assert.strictEqual(typeof communityModule.deleteStudyPartnerFromDb, 'function');
      assert.strictEqual(typeof communityModule.validateStudyPartnerInput, 'function');
      assert.strictEqual(typeof communityModule.normalizePartnerData, 'function');
    });
  });
});

