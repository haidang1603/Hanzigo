import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SMART_NAV_CATALOG,
  recordNavigationVisit,
  getNavVisitStats,
  getPinnedNavTabs,
  togglePinnedNavTab,
  getSmartNavSuggestions,
} from '../src/utils/smartNavEngine.js';

test('smartNavEngine records navigation visits and computes contextual suggestions', () => {
  recordNavigationVisit('hsk');
  recordNavigationVisit('hsk');
  const stats = getNavVisitStats();
  assert.ok(stats.hsk.count >= 2);

  const suggestions = getSmartNavSuggestions('hsk', null, 3);
  assert.equal(suggestions.length, 3);
  assert.ok(!suggestions.some((s) => s.id === 'hsk'));
  assert.ok(suggestions.some((s) => s.id === 'vocabulary'));
});

test('smartNavEngine toggles pinned tabs and respects role access', () => {
  const initial = getPinnedNavTabs();
  assert.ok(Array.isArray(initial));

  const toggled = togglePinnedNavTab('pronunciation');
  assert.ok(toggled.includes('pronunciation'));
  const untoggled = togglePinnedNavTab('pronunciation');
  assert.ok(!untoggled.includes('pronunciation'));

  const studentPicks = getSmartNavSuggestions('home', { role: 'student' }, 10);
  assert.ok(!studentPicks.some((s) => s.id === 'admin' || s.id === 'teacher'));
  assert.ok(SMART_NAV_CATALOG.reader.badge === 'i+1');
});

