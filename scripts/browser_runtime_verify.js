import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const distDir = path.join(process.cwd(), 'dist');

function startServer(port = 4173) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        let reqPath = req.url.split('?')[0];
        if (reqPath === '/') reqPath = '/index.html';
        let filePath = path.join(distDir, reqPath);

        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          filePath = path.join(distDir, 'index.html');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const content = fs.readFileSync(filePath);

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch (err) {
        res.writeHead(500);
        res.end(String(err));
      }
    });

    server.listen(port, () => resolve(server));
    server.on('error', reject);
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.nextId = 1;
    this.callbacks = new Map();
    this.events = [];
    this.consoleLogs = [];
    this.pageErrors = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.id && this.callbacks.has(msg.id)) {
            const cb = this.callbacks.get(msg.id);
            this.callbacks.delete(msg.id);
            if (msg.error) cb.reject(new Error(msg.error.message));
            else cb.resolve(msg.result);
          } else if (msg.method) {
            this.events.push(msg);
            if (msg.method === 'Runtime.consoleAPICalled') {
              this.consoleLogs.push(msg.params);
            }
            if (msg.method === 'Runtime.exceptionThrown') {
              this.pageErrors.push(msg.params);
            }
          }
        } catch (err) {
          console.error('WS parse error:', err);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || res.exceptionDetails.text || 'Evaluation failed');
    }
    return res.result?.value;
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });
  }

  close() {
    if (this.ws) {
      try { this.ws.close(); } catch {}
    }
  }
}

async function runTests() {
  console.log('--- STARTING RUNTIME BROWSER VERIFICATION ---');
  const server = await startServer(4173);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const cdpPort = 9222;
  const userDataDir = path.join(process.cwd(), '.chrome_verify_profile');

  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    'http://localhost:4173'
  ], { stdio: 'ignore' });

  await new Promise(r => setTimeout(r, 2000));

  const getCdpInfo = () => new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${cdpPort}/json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const targets = await getCdpInfo();
  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) throw new Error('No page target found');

  const cdp = new CdpClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('DOM.enable');

  const results = {
    desktop: {},
    tablet: {},
    mobile: {},
    commandPalette: {},
    routeAuth: {},
    consoleErrors: []
  };

  try {
    await cdp.send('Page.navigate', { url: 'http://localhost:4173/#home' });
    await new Promise(r => setTimeout(r, 2000));

    // ==========================================
    // 1. DESKTOP VERIFICATION (1440x900)
    // ==========================================
    console.log('\n[1/5] Testing Desktop Viewport (1440x900)...');
    await cdp.setViewport(1440, 900);
    await new Promise(r => setTimeout(r, 600));

    const desktopInfo = await cdp.evaluate(`(() => {
      const sidebar = document.querySelector('aside[aria-label="Sidebar điều hướng"]');
      const header = document.querySelector('header');
      const breadcrumbs = document.querySelector('nav[aria-label="Breadcrumb"]');
      const bottomNav = document.querySelector('nav[aria-label="Điều hướng nhanh di động"]');
      
      const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null;
      const headerRect = header ? header.getBoundingClientRect() : null;
      
      return {
        sidebarExists: !!sidebar,
        sidebarWidth: sidebarRect ? Math.round(sidebarRect.width) : 0,
        sidebarVisible: sidebar ? window.getComputedStyle(sidebar).display !== 'none' : false,
        headerExists: !!header,
        headerHeight: headerRect ? Math.round(headerRect.height) : 0,
        headerPosition: header ? window.getComputedStyle(header).position : null,
        breadcrumbsOnHome: !!breadcrumbs,
        bottomNavVisible: bottomNav ? window.getComputedStyle(bottomNav).display !== 'none' : false,
        bodyScrollWidth: document.body.scrollWidth,
        windowInnerWidth: window.innerWidth,
        hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth,
        localStorageCollapsed: localStorage.getItem('hanzigo_sidebar_collapsed')
      };
    })()`);

    results.desktop.expanded = desktopInfo;
    console.log('Desktop Expanded:', JSON.stringify(desktopInfo, null, 2));

    // Toggle collapse on Desktop
    console.log('Testing Sidebar toggle collapse button...');
    const collapseToggleResult = await cdp.evaluate(`(() => {
      const toggleBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.getAttribute('title')?.includes('Thu gọn') || 
        b.getAttribute('title')?.includes('Mở rộng')
      );
      if (toggleBtn) {
        toggleBtn.click();
        return { clicked: true, title: toggleBtn.getAttribute('title') };
      }
      return { clicked: false };
    })()`);
    console.log('Toggle click:', collapseToggleResult);

    await new Promise(r => setTimeout(r, 600));

    const desktopCollapsedInfo = await cdp.evaluate(`(() => {
      const sidebar = document.querySelector('aside[aria-label="Sidebar điều hướng"]');
      const sidebarRect = sidebar ? sidebar.getBoundingClientRect() : null;
      return {
        sidebarWidth: sidebarRect ? Math.round(sidebarRect.width) : 0,
        localStorageCollapsed: localStorage.getItem('hanzigo_sidebar_collapsed')
      };
    })()`);

    results.desktop.collapsed = desktopCollapsedInfo;
    console.log('Desktop Collapsed:', JSON.stringify(desktopCollapsedInfo, null, 2));

    // Toggle back to expanded
    await cdp.evaluate(`(() => {
      const toggleBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.getAttribute('title')?.includes('Thu gọn') || 
        b.getAttribute('title')?.includes('Mở rộng')
      );
      if (toggleBtn) toggleBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 400));

    // Breadcrumbs verification on subpage
    console.log('Testing Breadcrumbs on subpage (#grammar)...');
    await cdp.send('Page.navigate', { url: 'http://localhost:4173/#grammar' });
    await new Promise(r => setTimeout(r, 1200));

    const breadcrumbsInfo = await cdp.evaluate(`(() => {
      const bc = document.querySelector('nav[aria-label="Breadcrumb"]');
      if (!bc) return { exists: false };
      return {
        exists: true,
        text: bc.textContent.trim(),
        hasPracticeStep: bc.textContent.includes('Luyện tập'),
        hasGrammarStep: bc.textContent.includes('Ngữ pháp')
      };
    })()`);
    results.desktop.breadcrumbs = breadcrumbsInfo;
    console.log('Breadcrumbs (#grammar):', JSON.stringify(breadcrumbsInfo, null, 2));

    // ==========================================
    // 2. TABLET VERIFICATION (768x1024)
    // ==========================================
    console.log('\n[2/5] Testing Tablet Viewport (768x1024)...');
    await cdp.setViewport(768, 1024);
    await new Promise(r => setTimeout(r, 600));

    const tabletInfo = await cdp.evaluate(`(() => {
      const sidebar = document.querySelector('aside[aria-label="Sidebar điều hướng"]');
      const bottomNav = document.querySelector('nav[aria-label="Điều hướng nhanh di động"]');
      const header = document.querySelector('header');
      return {
        sidebarVisible: sidebar ? window.getComputedStyle(sidebar).display !== 'none' : false,
        bottomNavVisible: bottomNav ? window.getComputedStyle(bottomNav).display !== 'none' : false,
        headerExists: !!header,
        bodyScrollWidth: document.body.scrollWidth,
        windowInnerWidth: window.innerWidth,
        hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth
      };
    })()`);
    results.tablet = tabletInfo;
    console.log('Tablet (768x1024):', JSON.stringify(tabletInfo, null, 2));

    // ==========================================
    // 3. MOBILE VERIFICATION (390x844)
    // ==========================================
    console.log('\n[3/5] Testing Mobile Viewport (390x844)...');
    await cdp.setViewport(390, 844);
    await new Promise(r => setTimeout(r, 600));

    const mobileInfo = await cdp.evaluate(`(() => {
      const sidebar = document.querySelector('aside[aria-label="Sidebar điều hướng"]');
      const bottomNav = document.querySelector('nav[aria-label="Điều hướng nhanh di động"]');
      const buttons = bottomNav ? Array.from(bottomNav.querySelectorAll('button')) : [];
      
      const touchTargets = buttons.map(b => {
        const r = b.getBoundingClientRect();
        return {
          text: b.textContent.trim(),
          width: Math.round(r.width),
          height: Math.round(r.height),
          meetsMinTarget: r.width >= 44 && r.height >= 44
        };
      });

      return {
        sidebarVisible: sidebar ? window.getComputedStyle(sidebar).display !== 'none' : false,
        bottomNavVisible: bottomNav ? window.getComputedStyle(bottomNav).display !== 'none' : false,
        bottomNavButtonCount: buttons.length,
        touchTargets,
        bodyScrollWidth: document.body.scrollWidth,
        windowInnerWidth: window.innerWidth,
        hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth
      };
    })()`);
    results.mobile = mobileInfo;
    console.log('Mobile (390x844):', JSON.stringify(mobileInfo, null, 2));

    // Test Mobile Drawer open
    console.log('Testing Mobile Drawer...');
    await cdp.evaluate(`(() => {
      const bottomNav = document.querySelector('nav[aria-label="Điều hướng nhanh di động"]');
      const moreBtn = bottomNav ? Array.from(bottomNav.querySelectorAll('button')).find(b => b.textContent.includes('Thêm')) : null;
      if (moreBtn) moreBtn.click();
    })()`);

    await new Promise(r => setTimeout(r, 600));

    const drawerState = await cdp.evaluate(`(() => {
      const drawer = document.querySelector('div[role="dialog"][aria-label="Menu điều hướng di động"]');
      return {
        drawerOpen: !!drawer,
        drawerAriaModal: drawer ? drawer.getAttribute('aria-modal') : null
      };
    })()`);
    results.mobile.drawerState = drawerState;
    console.log('Mobile Drawer State:', JSON.stringify(drawerState, null, 2));

    // Close drawer via close button inside drawer
    await cdp.evaluate(`(() => {
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.getAttribute('title')?.includes('Đóng') || 
        b.querySelector('svg.lucide-x')
      );
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 500));

    // ==========================================
    // 4. SMART COMMAND PALETTE VERIFICATION
    // ==========================================
    console.log('\n[4/5] Testing Smart Command Palette...');
    await cdp.setViewport(1440, 900);
    await new Promise(r => setTimeout(r, 500));

    // Open via Header Search Button click
    console.log('Clicking Header Search button to open Command Palette...');
    const searchBtnClicked = await cdp.evaluate(`(() => {
      const searchBtn = document.querySelector('button[aria-label="Mở tìm kiếm nhanh (Ctrl + K)"]');
      if (searchBtn) {
        searchBtn.click();
        return true;
      }
      return false;
    })()`);
    console.log('Search button clicked:', searchBtnClicked);

    await new Promise(r => setTimeout(r, 800));

    const cmdPaletteState = await cdp.evaluate(`(() => {
      const dialog = document.querySelector('div[role="dialog"][aria-label="Truy cập nhanh & Tìm kiếm thông minh"]');
      const input = dialog ? dialog.querySelector('input') : null;
      return {
        isOpen: !!dialog,
        role: dialog ? dialog.getAttribute('role') : null,
        ariaModal: dialog ? dialog.getAttribute('aria-modal') : null,
        inputFocused: document.activeElement === input,
        placeholder: input ? input.placeholder : null
      };
    })()`);
    results.commandPalette.initial = cmdPaletteState;
    console.log('Command Palette Open:', JSON.stringify(cmdPaletteState, null, 2));

    // Type query "chao hoi" (unaccented Vietnamese for Lesson 101)
    console.log('Testing unaccented search "chao hoi"...');
    await cdp.evaluate(`(() => {
      const input = document.querySelector('div[role="dialog"] input');
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, 'chao hoi');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise(r => setTimeout(r, 800));

    const searchResultsUnaccented = await cdp.evaluate(`(() => {
      const dialog = document.querySelector('div[role="dialog"]');
      if (!dialog) return { found: 0 };
      const items = Array.from(dialog.querySelectorAll('span.font-bold'))
        .map(el => el.textContent.trim())
        .filter(t => t.length > 0);
      return {
        count: items.length,
        itemsSummary: items.slice(0, 5),
        hasLesson101: items.some(t => t.includes('101') || t.includes('Chào hỏi'))
      };
    })()`);
    results.commandPalette.unaccentedSearch = searchResultsUnaccented;
    console.log('Search "chao hoi" results:', JSON.stringify(searchResultsUnaccented, null, 2));

    // Test ESC to close
    console.log('Testing ESC to close Command Palette...');
    await cdp.evaluate(`(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        bubbles: true
      });
      window.dispatchEvent(event);
    })()`);
    await new Promise(r => setTimeout(r, 500));

    const cmdClosed = await cdp.evaluate(`(() => {
      const dialog = document.querySelector('div[role="dialog"][aria-label="Truy cập nhanh & Tìm kiếm thông minh"]');
      return { isOpen: !!dialog };
    })()`);
    results.commandPalette.closedWithEsc = !cmdClosed.isOpen;
    console.log('Command Palette Closed with ESC:', !cmdClosed.isOpen);

    // ==========================================
    // 5. ROUTE AUTHORIZATION & ROLE ISOLATION
    // ==========================================
    console.log('\n[5/5] Testing Route Authorization & Guards...');
    
    // Case 1: Anonymous student accessing #admin
    await cdp.evaluate(`(() => {
      localStorage.removeItem('hanzigo_user');
      window.location.hash = '#admin';
    })()`);
    await new Promise(r => setTimeout(r, 1200));

    const adminGuardResult = await cdp.evaluate(`(() => {
      return {
        isBlockedByAdminGuard: document.body.textContent.includes('Khu vực Quản trị Bảo mật'),
        hasAdminDataLeaked: document.body.textContent.includes('Danh sách người dùng')
      };
    })()`);
    results.routeAuth.anonymousAdmin = adminGuardResult;
    console.log('Anonymous -> #admin:', JSON.stringify(adminGuardResult, null, 2));

    // Case 2: Student accessing #teacher
    await cdp.evaluate(`(() => {
      localStorage.setItem('hanzigo_user', JSON.stringify({
        id: 'std_01',
        role: 'student',
        name: 'Học viên A'
      }));
      window.location.hash = '#teacher';
    })()`);
    await new Promise(r => setTimeout(r, 1200));

    const teacherGuardResult = await cdp.evaluate(`(() => {
      return {
        isBlockedByTeacherGuard: document.body.textContent.includes('Khu vực Dành riêng cho Giáo viên'),
        hasTeacherDashboardLeaked: document.body.textContent.includes('Tổng quan giảng dạy')
      };
    })()`);
    results.routeAuth.studentTeacher = teacherGuardResult;
    console.log('Student -> #teacher:', JSON.stringify(teacherGuardResult, null, 2));

    // Case 3: Student attempting localStorage tampering to become 'admin'
    console.log('Testing Client Tampering (localStorage role=admin with unverified session)...');
    await cdp.evaluate(`(() => {
      // Attacker changes localStorage
      localStorage.setItem('hanzigo_user', JSON.stringify({
        id: 'fake_admin',
        role: 'admin',
        name: 'Attacker'
      }));
    })()`);
    // Reload page to see how AuthProvider handles unverified cached role
    await cdp.send('Page.navigate', { url: 'http://localhost:4173/#admin' });
    await new Promise(r => setTimeout(r, 1500));

    const tamperResult = await cdp.evaluate(`(() => {
      // In AuthProvider.jsx: Zero Trust client cache defaults to 'student' until server session verified
      return {
        isBlockedAfterTamper: document.body.textContent.includes('Khu vực Quản trị Bảo mật'),
        hasAdminDataLeaked: document.body.textContent.includes('Danh sách người dùng')
      };
    })()`);
    results.routeAuth.tamperedAdmin = tamperResult;
    console.log('Tampered localStorage -> #admin:', JSON.stringify(tamperResult, null, 2));

    // Capture console errors
    results.consoleErrors = cdp.pageErrors;
    console.log('\nPage Exceptions Recorded:', cdp.pageErrors.length);

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    cdp.close();
    chromeProc.kill('SIGKILL');
    server.close();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
    console.log('\n--- BROWSER RUNTIME VERIFICATION COMPLETE ---');
    fs.writeFileSync(path.join(process.cwd(), 'runtime_verification_results.json'), JSON.stringify(results, null, 2));
  }
}

runTests().catch(console.error);
