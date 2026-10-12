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
});

test('4. ROUTING INTEGRITY: App.jsx registers privacy and terms in VALID_TABS and renders components', () => {
  const appPath = path.join(projectRoot, 'src', 'App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf8');

  assert.ok(appContent.includes("'privacy'"), "VALID_TABS should contain 'privacy'");
  assert.ok(appContent.includes("'terms'"), "VALID_TABS should contain 'terms'");
  assert.ok(appContent.includes("PrivacyPolicyPage = lazy"), 'PrivacyPolicyPage should be lazy loaded');
  assert.ok(appContent.includes("TermsOfServicePage = lazy"), 'TermsOfServicePage should be lazy loaded');
  assert.ok(appContent.includes("activeTab === 'privacy'"), "App.jsx should conditionally render PrivacyPolicyPage");
  assert.ok(appContent.includes("activeTab === 'terms'"), "App.jsx should conditionally render TermsOfServicePage");
});

test('5. FOOTER INTEGRITY: Footer.jsx includes accessible links and navigation handlers', () => {
  const footerPath = path.join(projectRoot, 'src', 'components', 'Footer.jsx');
  const footerContent = fs.readFileSync(footerPath, 'utf8');

  assert.ok(footerContent.includes('href="#privacy"'), 'Footer should have href="#privacy"');
  assert.ok(footerContent.includes('href="#terms"'), 'Footer should have href="#terms"');
  assert.ok(footerContent.includes("handleNav('privacy')"), 'Footer should trigger handleNav for privacy');
  assert.ok(footerContent.includes("handleNav('terms')"), 'Footer should trigger handleNav for terms');
});
