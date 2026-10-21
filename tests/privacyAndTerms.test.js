import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve('.');

test('1. PRIVACY & TERMS: Components exist and are non-empty', () => {
  const privacyPath = path.join(projectRoot, 'src', 'pages', 'PrivacyPolicyPage.jsx');
  const termsPath = path.join(projectRoot, 'src', 'pages', 'TermsOfServicePage.jsx');

  assert.ok(fs.existsSync(privacyPath), 'PrivacyPolicyPage.jsx should exist');
  assert.ok(fs.existsSync(termsPath), 'TermsOfServicePage.jsx should exist');

  const privacyContent = fs.readFileSync(privacyPath, 'utf8');
  const termsContent = fs.readFileSync(termsPath, 'utf8');

  assert.ok(privacyContent.length > 5000, 'PrivacyPolicyPage should be detailed and comprehensive');
  assert.ok(termsContent.length > 5000, 'TermsOfServicePage should be detailed and comprehensive');
});

test('2. PRIVACY POLICY: Complies with Vietnamese decree and zero-retention voice policy', () => {
  const privacyPath = path.join(projectRoot, 'src', 'pages', 'PrivacyPolicyPage.jsx');
  const content = fs.readFileSync(privacyPath, 'utf8');

  // Verify key legal and security clauses
  assert.ok(content.includes('13/2023/NĐ-CP'), 'Should reference Vietnamese personal data decree 13/2023/NĐ-CP');
  assert.ok(content.includes('Chính Sách Bảo Mật'), 'Should have standard Vietnamese title');
  assert.ok(content.includes('Zero-Trust') || content.includes('Row-Level Security'), 'Should describe Supabase RLS / Zero-Trust model');
  assert.ok(content.includes('giọng nói') || content.includes('Microphone'), 'Should explain zero-retention voice and microphone policy');
  assert.ok(content.includes('trẻ vị thành niên') || content.includes('16 tuổi'), 'Should have minor data protection section');
  assert.ok(content.includes('lehaidang16032006@gmail.com'), 'Should provide contact email');
  assert.ok(content.includes('Third-Party Processors') || content.includes('Bên Thứ Ba'), 'Should disclose third party processors');
  assert.ok(content.includes('Thời Hạn Lưu Trữ') || content.includes('retention'), 'Should disclose retention periods');
});

test('3. TERMS OF SERVICE: Complies with academic copyright, OER licenses, and LiveKit rules', () => {
  const termsPath = path.join(projectRoot, 'src', 'pages', 'TermsOfServicePage.jsx');
  const content = fs.readFileSync(termsPath, 'utf8');

  // Verify intellectual property and disclaimer clauses
  assert.ok(content.includes('Điều Khoản Sử Dụng'), 'Should have standard Vietnamese title');
  assert.ok(content.includes('CTI') || content.includes('Hanban'), 'Should acknowledge official CTI / Hanban HSK exam trademarks');
  assert.ok(content.includes('CC BY-NC-SA 4.0') || content.includes('OER'), 'Should state open educational resources policy');
  assert.ok(content.includes('LiveKit') || content.includes('phòng học trực tuyến'), 'Should define classroom and community conduct');
  assert.ok(content.includes('Miễn Trừ') || content.includes('chứng chỉ HSK chính thức'), 'Should clarify mock exam scores do not replace official CTI certificate');
  assert.ok(content.includes('lehaidang16032006@gmail.com'), 'Should provide Legal / Academic affairs contact email');
  assert.ok(content.includes('Trợ lý AI') || content.includes('ảo giác') || content.includes('hallucination'), 'Should contain AI Tutor disclaimer');
});

test('4. ROUTING INTEGRITY: App.jsx registers legal routes and renders components', () => {
  const appPath = path.join(projectRoot, 'src', 'App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf8');

  assert.ok(appContent.includes("'privacy'"), "VALID_TABS should contain 'privacy'");
  assert.ok(appContent.includes("'terms'"), "VALID_TABS should contain 'terms'");
  assert.ok(appContent.includes("'cookies'"), "VALID_TABS should contain 'cookies'");
  assert.ok(appContent.includes("'refund'"), "VALID_TABS should contain 'refund'");
  assert.ok(appContent.includes("PrivacyPolicyPage = lazy"), 'PrivacyPolicyPage should be lazy loaded');
  assert.ok(appContent.includes("TermsOfServicePage = lazy"), 'TermsOfServicePage should be lazy loaded');
  assert.ok(appContent.includes("CookiePolicyPage = lazy"), 'CookiePolicyPage should be lazy loaded');
  assert.ok(appContent.includes("RefundPolicyPage = lazy"), 'RefundPolicyPage should be lazy loaded');
  assert.ok(appContent.includes("activeTab === 'privacy'"), "App.jsx should conditionally render PrivacyPolicyPage");
  assert.ok(appContent.includes("activeTab === 'terms'"), "App.jsx should conditionally render TermsOfServicePage");
  assert.ok(appContent.includes("activeTab === 'cookies'"), "App.jsx should conditionally render CookiePolicyPage");
  assert.ok(appContent.includes("activeTab === 'refund'"), "App.jsx should conditionally render RefundPolicyPage");
  assert.ok(appContent.includes("<StorageConsentBanner"), 'App.jsx should include StorageConsentBanner');
});

test('5. FOOTER INTEGRITY: Footer.jsx includes accessible links and navigation handlers', () => {
  const footerPath = path.join(projectRoot, 'src', 'components', 'Footer.jsx');
  const footerContent = fs.readFileSync(footerPath, 'utf8');

  assert.ok(footerContent.includes('href="#privacy"'), 'Footer should have href="#privacy"');
  assert.ok(footerContent.includes('href="#terms"'), 'Footer should have href="#terms"');
  assert.ok(footerContent.includes('href="#cookies"'), 'Footer should have href="#cookies"');
  assert.ok(footerContent.includes('href="#refund"'), 'Footer should have href="#refund"');
  assert.ok(footerContent.includes("handleNav('privacy')"), 'Footer should trigger handleNav for privacy');
  assert.ok(footerContent.includes("handleNav('terms')"), 'Footer should trigger handleNav for terms');
  assert.ok(footerContent.includes("handleNav('cookies')"), 'Footer should trigger handleNav for cookies');
  assert.ok(footerContent.includes("handleNav('refund')"), 'Footer should trigger handleNav for refund');
  assert.ok(footerContent.includes('Thông báo quyền riêng tư:'), 'Footer newsletter form should have pre-collection notice');
});

test('6. COOKIE & REFUND POLICIES: Components exist and accurately reflect system state', () => {
  const cookiePath = path.join(projectRoot, 'src', 'pages', 'CookiePolicyPage.jsx');
  const refundPath = path.join(projectRoot, 'src', 'pages', 'RefundPolicyPage.jsx');

  assert.ok(fs.existsSync(cookiePath), 'CookiePolicyPage.jsx should exist');
  assert.ok(fs.existsSync(refundPath), 'RefundPolicyPage.jsx should exist');

  const cookieContent = fs.readFileSync(cookiePath, 'utf8');
  const refundContent = fs.readFileSync(refundPath, 'utf8');

  assert.ok(cookieContent.includes('Local Storage') || cookieContent.includes('LocalStorage'), 'Should document Local Storage');
  assert.ok(cookieContent.includes('hanzigo_completed_lessons'), 'Should document actual storage keys');
  assert.ok(refundContent.includes('miễn phí') || refundContent.includes('Miễn phí'), 'Should state current free status');
  assert.ok(refundContent.includes('Checklist') || refundContent.includes('thương mại'), 'Should contain commercialization checklist');
});

test('7. AUTH MODAL: Accessible dialog, pre-collection notice, and consent checkboxes', () => {
  const authModalPath = path.join(projectRoot, 'src', 'components', 'AuthModal.jsx');
  const authContent = fs.readFileSync(authModalPath, 'utf8');

  assert.ok(authContent.includes('role="dialog"'), 'AuthModal should have role="dialog"');
  assert.ok(authContent.includes('aria-modal="true"'), 'AuthModal should have aria-modal="true"');
  assert.ok(authContent.includes('Escape'), 'AuthModal should support Escape key dismissal');
  assert.ok(authContent.includes('agreeTerms'), 'AuthModal should have agreeTerms state');
  assert.ok(authContent.includes('Thông báo thu thập:'), 'AuthModal should have pre-collection notice');
});

test('8. DATA SUBJECT REQUEST (DSAR): Modal exists with data export and deletion safeguards', () => {
  const dsarPath = path.join(projectRoot, 'src', 'components', 'DataSubjectRequestModal.jsx');
  assert.ok(fs.existsSync(dsarPath), 'DataSubjectRequestModal.jsx should exist');

  const dsarContent = fs.readFileSync(dsarPath, 'utf8');
  assert.ok(dsarContent.includes('13/2023/NĐ-CP'), 'Should reference Decree 13/2023/ND-CP');
  assert.ok(dsarContent.includes('XÓA TÀI KHOẢN VĨNH VIỄN'), 'Should have explicit confirmation text check');
  assert.ok(dsarContent.includes('isTeacher'), 'Should have safety check for teacher accounts');
  assert.ok(dsarContent.includes('handleExportData'), 'Should support JSON data export');
});

test('9. STORAGE CONSENT BANNER: Genuine control without fake banners', () => {
  const bannerPath = path.join(projectRoot, 'src', 'components', 'StorageConsentBanner.jsx');
  assert.ok(fs.existsSync(bannerPath), 'StorageConsentBanner.jsx should exist');

  const bannerContent = fs.readFileSync(bannerPath, 'utf8');
  assert.ok(bannerContent.includes('hanzigo_storage_consent'), 'Should use hanzigo_storage_consent key');
  assert.ok(bannerContent.includes('Chỉ dữ liệu thiết yếu'), 'Should provide reject optional button');
  assert.ok(bannerContent.includes('Tùy chỉnh'), 'Should support custom preference configuration');
  assert.ok(bannerContent.includes('saveStoredConsent'), 'Should save user consent state');
});
