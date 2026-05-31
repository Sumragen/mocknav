/*!
 * mocknav.js — v1.0.0
 * HTML mockup navigator. One script tag, zero dependencies.
 * https://github.com/Sumragen/mocknav · MIT License
 */

(function () {
  'use strict';

  // ─── css ─────────────────────────────────────────────────────────────────────

  const CSS = `
    .mn-shell {
      --mn-sidebar: 224px;
      --mn-bar: 44px;
      --mn-bg0: #fff;
      --mn-bg1: #f6f5f3;
      --mn-bg2: #eceae6;
      --mn-bg3: #e2dfda;
      --mn-bd:  rgba(0,0,0,.09);
      --mn-bd2: rgba(0,0,0,.15);
      --mn-tx0: #181816;
      --mn-tx1: #5c5c58;
      --mn-tx2: #9a9a95;
      --mn-acc: #1a6ef5;
      --mn-acc-bg: #eaf0fe;

      all: initial;
      display: flex;
      position: fixed;
      inset: 0;
      font: 13px/1.5 -apple-system, 'Segoe UI', system-ui, sans-serif;
      color: var(--mn-tx0);
      background: var(--mn-bg1);
      z-index: 999999;
      box-sizing: border-box;
    }

    @media (prefers-color-scheme: dark) {
      .mn-shell {
        --mn-bg0: #1b1b19;
        --mn-bg1: #222220;
        --mn-bg2: #2a2a27;
        --mn-bg3: #323230;
        --mn-bd:  rgba(255,255,255,.08);
        --mn-bd2: rgba(255,255,255,.14);
        --mn-tx0: #e8e6e1;
        --mn-tx1: #888883;
        --mn-tx2: #545450;
        --mn-acc: #4d8ef7;
        --mn-acc-bg: #192845;
      }
    }

    .mn-shell *, .mn-shell *::before, .mn-shell *::after {
      box-sizing: border-box;
      margin: 0; padding: 0;
    }

    /* ── sidebar ── */

    .mn-sidebar {
      width: var(--mn-sidebar);
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      background: var(--mn-bg0);
      border-right: 1px solid var(--mn-bd);
      height: 100%;
      overflow: hidden;
    }

    .mn-sidebar-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 14px;
      height: var(--mn-bar);
      border-bottom: 1px solid var(--mn-bd);
      flex-shrink: 0;
    }

    .mn-project-name {
      flex: 1;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: -.01em;
      color: var(--mn-tx0);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mn-count {
      font-size: 11px;
      color: var(--mn-tx2);
      background: var(--mn-bg2);
      border: 1px solid var(--mn-bd);
      padding: 1px 7px;
      border-radius: 99px;
      flex-shrink: 0;
    }

    .mn-search {
      margin: 8px;
      padding: 6px 10px;
      font: 13px/1 -apple-system, 'Segoe UI', system-ui, sans-serif;
      background: var(--mn-bg1);
      border: 1px solid var(--mn-bd);
      border-radius: 7px;
      color: var(--mn-tx0);
      outline: none;
      width: calc(100% - 16px);
      -webkit-appearance: none;
    }
    .mn-search::placeholder { color: var(--mn-tx2); }
    .mn-search:focus { border-color: var(--mn-acc); }

    .mn-nav {
      flex: 1;
      overflow-y: auto;
      padding: 4px 6px 16px;
      scrollbar-width: thin;
      scrollbar-color: var(--mn-bd) transparent;
    }
    .mn-nav::-webkit-scrollbar { width: 4px; }
    .mn-nav::-webkit-scrollbar-thumb { background: var(--mn-bd2); border-radius: 4px; }

    .mn-group {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: var(--mn-tx2);
      padding: 12px 8px 3px;
      user-select: none;
    }

    .mn-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      border-radius: 7px;
      cursor: pointer;
      border: 1px solid transparent;
      margin-bottom: 1px;
      user-select: none;
      color: var(--mn-tx0);
    }
    .mn-item:hover { background: var(--mn-bg1); }
    .mn-item.mn-active { background: var(--mn-bg2); border-color: var(--mn-bd2); }

    .mn-item-name {
      flex: 1;
      font-size: 12.5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mn-dots { display: flex; gap: 3px; align-items: center; }
    .mn-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--mn-tx2);
      flex-shrink: 0;
    }
    .mn-dot[data-s="error"]   { background: #e24b4a; }
    .mn-dot[data-s="success"] { background: #2d9a4e; }
    .mn-dot[data-s="loading"] { background: #d08a0e; }
    .mn-dot[data-s="empty"]   { background: #5b8fc9; }
    .mn-dot[data-s="active"]  { background: #7b5cf5; }
    .mn-dot[data-s="hover"]   { background: var(--mn-acc); }

    .mn-badge {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
      padding: 2px 5px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .mn-badge-new    { background: #dff7e6; color: #1a7a3a; }
    .mn-badge-wip    { background: #fff3d6; color: #7a5000; }
    .mn-badge-done   { background: #e3edfe; color: #1a50c8; }
    .mn-badge-review { background: #fde3ef; color: #a0195a; }

    .mn-empty-search {
      padding: 24px 12px;
      text-align: center;
      color: var(--mn-tx2);
      font-size: 12px;
    }

    .mn-sidebar-foot {
      border-top: 1px solid var(--mn-bd);
      padding: 0 12px;
      height: 34px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    .mn-footer-text {
      font-size: 11px;
      color: var(--mn-tx2);
    }

    /* ── main ── */

    .mn-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: 100%;
      overflow: hidden;
    }

    .mn-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 14px;
      height: var(--mn-bar);
      background: var(--mn-bg0);
      border-bottom: 1px solid var(--mn-bd);
      flex-shrink: 0;
    }

    .mn-toolbar-title {
      flex: 1;
      font-size: 13px;
      font-weight: 500;
      color: var(--mn-tx0);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mn-states { display: flex; gap: 3px; }

    .mn-state-btn {
      font: 11px/1 -apple-system, 'Segoe UI', system-ui, sans-serif;
      padding: 4px 11px;
      border-radius: 99px;
      border: 1px solid var(--mn-bd);
      background: transparent;
      color: var(--mn-tx1);
      cursor: pointer;
      white-space: nowrap;
    }
    .mn-state-btn:hover { background: var(--mn-bg1); color: var(--mn-tx0); }
    .mn-state-btn.mn-active { background: var(--mn-bg2); border-color: var(--mn-bd2); color: var(--mn-tx0); font-weight: 500; }

    .mn-devices { display: flex; gap: 2px; margin-left: 4px; }

    .mn-dev-btn {
      width: 28px; height: 28px;
      display: grid; place-items: center;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      cursor: pointer;
      font-size: 13px;
      color: var(--mn-tx1);
      line-height: 1;
    }
    .mn-dev-btn:hover { background: var(--mn-bg1); }
    .mn-dev-btn.mn-active { background: var(--mn-bg2); border-color: var(--mn-bd2); color: var(--mn-tx0); }

    /* ── stage ── */

    .mn-stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--mn-bg1);
      overflow: hidden;
      padding: 20px;
      position: relative;
    }

    .mn-viewport {
      background: var(--mn-bg0);
      border: 1px solid var(--mn-bd2);
      border-radius: 8px;
      overflow: auto;
      transition: width .2s ease, height .2s ease, border-radius .2s ease;
      position: relative;
      /* Contain mockup position:fixed / ::after overlays inside the preview panel */
      transform: translateZ(0);
    }
    .mn-viewport.mn-desktop { width: 100%; height: 100%; }
    .mn-viewport.mn-tablet  { width: 768px; max-width: 100%; height: 100%; max-height: 1024px; border-radius: 12px; }
    .mn-viewport.mn-mobile  { width: 390px; max-width: 100%; height: 100%; max-height: 844px;  border-radius: 20px; border-width: 3px; }

    .mn-page-content {
      position: relative;
      width: 100%;
      min-height: 100%;
    }

    .mn-page-content.mn-pending {
      visibility: hidden;
    }

    .mn-mockup-body {
      position: relative;
      min-height: 100%;
    }

    .mn-page-content .mn-mockup-body::before,
    .mn-page-content .mn-mockup-body::after {
      position: absolute !important;
    }

    .mn-page-frame {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 480px;
      border: 0;
      background: var(--mn-bg0);
    }

    .mn-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      height: 100%;
      color: var(--mn-tx2);
      font-size: 13px;
    }

    .mn-placeholder svg { opacity: .2; }

    .mn-error-box {
      padding: 20px;
      color: var(--mn-tx1);
      font-size: 13px;
      text-align: center;
    }

    /* ── notice ── */

    .mn-notice {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: #fffbeb;
      border: 1px solid #f0c040;
      border-radius: 8px;
      padding: 9px 14px;
      font-size: 12px;
      color: #5a4000;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,.08);
      pointer-events: none;
    }

    /* ── status bar ── */

    .mn-statusbar {
      display: flex;
      align-items: center;
      padding: 0 14px;
      height: 32px;
      background: var(--mn-bg0);
      border-top: 1px solid var(--mn-bd);
      gap: 10px;
      flex-shrink: 0;
    }

    .mn-status-path {
      flex: 1;
      font: 11px/1 'JetBrains Mono', ui-monospace, monospace;
      color: var(--mn-tx2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mn-open-link {
      font-size: 11px;
      color: var(--mn-acc);
      text-decoration: none;
      padding: 2px 8px;
      border-radius: 5px;
      border: 1px solid var(--mn-bd);
      flex-shrink: 0;
      white-space: nowrap;
    }
    .mn-open-link:hover { background: var(--mn-acc-bg); }
    .mn-open-link[hidden] { display: none; }
  `;

  // ─── html skeleton ────────────────────────────────────────────────────────────

  const HTML = `
    <div class="mn-sidebar">
      <div class="mn-sidebar-head">
        <span class="mn-project-name" id="mn-name"></span>
        <span class="mn-count" id="mn-count"></span>
      </div>
      <input class="mn-search" id="mn-search" type="search" placeholder="Search…" autocomplete="off">
      <nav class="mn-nav" id="mn-nav"></nav>
      <div class="mn-sidebar-foot">
        <span class="mn-footer-text">mocknav</span>
      </div>
    </div>

    <div class="mn-main">
      <div class="mn-toolbar">
        <span class="mn-toolbar-title" id="mn-title">—</span>
        <div class="mn-states" id="mn-states"></div>
        <div class="mn-devices" id="mn-devices">
          <button class="mn-dev-btn mn-active" data-device="desktop" title="Desktop">⬛</button>
          <button class="mn-dev-btn" data-device="tablet"  title="Tablet">▬</button>
          <button class="mn-dev-btn" data-device="mobile"  title="Mobile">▯</button>
        </div>
      </div>

      <div class="mn-stage" id="mn-stage">
        <div class="mn-viewport mn-desktop" id="mn-viewport">
          <div class="mn-placeholder" id="mn-placeholder">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
            </svg>
            Select a page
          </div>
        </div>
      </div>

      <div class="mn-statusbar">
        <span class="mn-status-path" id="mn-path"></span>
        <a class="mn-open-link" id="mn-open" target="_blank" hidden>↗ open</a>
      </div>
    </div>
  `;

  // ─── core ─────────────────────────────────────────────────────────────────────

  let pages   = [];
  let st      = { pageId: null, stateId: null, device: 'desktop', query: '' };
  let cfg     = {};
  /** External script URLs already loaded this session (shared CDNs, etc.) */
  const loadedScripts = new Set();

  const $ = id => document.getElementById(id);

  function normalise(raw) {
    return raw.map((p, i) => ({
      group:  'Pages',
      tags:   [],
      badge:  null,
      states: [{ id: 'default', label: 'Default' }],
      ...p,
      id: p.id ?? `page-${i}`,
    }));
  }

  // ─── nav ─────────────────────────────────────────────────────────────────────

  function buildNav() {
    const nav = $('mn-nav');
    const q   = st.query.toLowerCase();

    const list = q
      ? pages.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.group.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        )
      : pages;

    nav.innerHTML = '';

    if (!list.length) {
      nav.innerHTML = '<div class="mn-empty-search">No results</div>';
      return;
    }

    const groups = {};
    list.forEach(p => (groups[p.group] ??= []).push(p));

    for (const [label, items] of Object.entries(groups)) {
      const gl = document.createElement('div');
      gl.className   = 'mn-group';
      gl.textContent = label;
      nav.appendChild(gl);

      for (const p of items) {
        const row = document.createElement('div');
        row.className = 'mn-item' + (p.id === st.pageId ? ' mn-active' : '');
        row.dataset.id = p.id;

        const name = document.createElement('span');
        name.className   = 'mn-item-name';
        name.textContent = p.name;

        const dots = document.createElement('div');
        dots.className = 'mn-dots';
        for (const s of p.states.slice(0, 5)) {
          const d = document.createElement('div');
          d.className    = 'mn-dot';
          d.dataset.s    = s.id;
          d.title        = s.label;
          dots.appendChild(d);
        }

        row.appendChild(name);
        row.appendChild(dots);

        if (p.badge) {
          const b = document.createElement('span');
          b.className   = `mn-badge mn-badge-${p.badge}`;
          b.textContent = p.badge;
          row.appendChild(b);
        }

        row.addEventListener('click', () => activatePage(p.id));
        nav.appendChild(row);
      }
    }
  }

  // ─── toolbar ─────────────────────────────────────────────────────────────────

  function buildToolbar(page) {
    $('mn-title').textContent = page.name;

    const wrap = $('mn-states');
    wrap.innerHTML = '';

    for (const s of page.states) {
      const btn = document.createElement('button');
      btn.className   = 'mn-state-btn' + (s.id === st.stateId ? ' mn-active' : '');
      btn.textContent = s.label;
      btn.addEventListener('click', () => activateState(s.id));
      wrap.appendChild(btn);
    }
  }

  // ─── preview ─────────────────────────────────────────────────────────────────

  function resolveFile(page, stateId) {
    const s = page.states.find(s => s.id === stateId);
    if (s?.file) return s.file;
    return stateId === 'default'
      ? page.file
      : `${page.file}?state=${stateId}`;
  }

  const STATE_CLASS_RE = /^state-/;
  const MOCK_ROOT      = 'mn-mockup-body';

  function cleanHostBodyState() {
    for (const cls of [...document.body.classList]) {
      if (STATE_CLASS_RE.test(cls)) document.body.classList.remove(cls);
    }
  }

  /** Apply state-* classes on the mockup root (embedded preview has no ?state= on location). */
  function applyMockState(root, stateId) {
    for (const cls of [...root.classList]) {
      if (STATE_CLASS_RE.test(cls)) root.classList.remove(cls);
    }
    if (stateId && stateId !== 'default') {
      root.classList.add('state-' + stateId);
    }
  }

  /** Map mockup `body {…}` / `body.state-x` rules to the embedded root div. */
  function rewriteMockupCss(css) {
    return css.replace(/\bbody\b/g, '.' + MOCK_ROOT);
  }

  function buildMockRoot(parsedBody, stateId) {
    const root = document.createElement('div');
    root.className = MOCK_ROOT;
    if (parsedBody.className) root.classList.add(...parsedBody.classList);
    root.append(...parsedBody.childNodes);
    applyMockState(root, stateId);
    return root;
  }

  function stripInlineScripts(root) {
    for (const old of [...root.querySelectorAll('script:not([src])')]) old.remove();
  }

  function waitScript(el) {
    if (el.dataset.mnLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      el.addEventListener('load', () => {
        el.dataset.mnLoaded = '1';
        resolve();
      }, { once: true });
      el.addEventListener('error', () => reject(new Error(`Failed to load ${el.src}`)), { once: true });
    });
  }

  /** Load external scripts in order; skip URLs already fetched this session. */
  async function ensureScripts(srcs, parent) {
    for (const src of srcs) {
      const abs = new URL(src, location.href).href;
      if (loadedScripts.has(abs)) continue;

      const inTree = [...parent.querySelectorAll('script[src]'), ...document.querySelectorAll('script[src]')]
        .find(s => new URL(s.src).href === abs);

      if (inTree) {
        await waitScript(inTree);
        loadedScripts.add(abs);
        continue;
      }

      const el = document.createElement('script');
      el.src = src;
      parent.appendChild(el);
      await waitScript(el);
      loadedScripts.add(abs);
    }
  }

  function settlePaint() {
    return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  }

  function loadPageFrame(viewport, file, pageName) {
    const frame = document.createElement('iframe');
    frame.className = 'mn-page-frame';
    frame.src       = file;
    frame.title     = pageName;
    viewport.appendChild(frame);
    $('mn-notice')?.remove();
  }

  async function loadPageInject(viewport, file, stateId) {
    let html;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      html = await res.text();
      $('mn-notice')?.remove();
    } catch (err) {
      showNotice(`Could not load ${file} — check the path or run a local server (npx serve .)`);
      viewport.innerHTML = `<div class="mn-error-box">
        Could not fetch <code>${file}</code><br>
        <small style="color:var(--mn-tx2)">${err.message}</small>
      </div>`;
      return;
    }

    const doc  = new DOMParser().parseFromString(html, 'text/html');
    const root = buildMockRoot(doc.body, stateId);
    const bodyScripts = [...root.querySelectorAll('script[src]')].map(s => s.src);
    stripInlineScripts(root);
    for (const old of [...root.querySelectorAll('script[src]')]) old.remove();

    const wrap = document.createElement('div');
    wrap.className = 'mn-page-content mn-pending';

    for (const node of doc.head.querySelectorAll('style, link[rel="stylesheet"]')) {
      if (node.tagName === 'STYLE') {
        const el = document.createElement('style');
        el.textContent = rewriteMockupCss(node.textContent);
        wrap.appendChild(el);
      } else {
        wrap.appendChild(node.cloneNode(true));
      }
    }

    viewport.appendChild(wrap);

    const headScripts = [...doc.head.querySelectorAll('script[src]')].map(s => s.src);
    await ensureScripts(headScripts, wrap);

    wrap.appendChild(root);
    await ensureScripts(bodyScripts, root);

    await settlePaint();
    wrap.classList.remove('mn-pending');
  }

  async function loadPage(page, stateId) {
    const file = resolveFile(page, stateId);

    $('mn-path').textContent = file;
    const link = $('mn-open');
    link.href   = file;
    link.hidden = false;

    const viewport = $('mn-viewport');
    viewport.innerHTML = '';
    cleanHostBodyState();

    if (location.protocol === 'file:') {
      loadPageFrame(viewport, file, page.name);
      return;
    }

    await loadPageInject(viewport, file, stateId);
  }

  function showNotice(msg) {
    if ($('mn-notice')) return;
    const n = document.createElement('div');
    n.className   = 'mn-notice';
    n.id          = 'mn-notice';
    n.textContent = msg;
    $('mn-stage').appendChild(n);
  }

  // ─── actions ─────────────────────────────────────────────────────────────────

  function readRoute() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (!parts.length) return null;
    return { pageId: decodeURIComponent(parts[0]), stateId: parts[1] ? decodeURIComponent(parts[1]) : null };
  }

  function syncHash() {
    if (!st.pageId) return;
    const next = `#${encodeURIComponent(st.pageId)}/${encodeURIComponent(st.stateId)}`;
    if (location.hash === next) return;
    const url = location.pathname + location.search + next;
    try {
      history.replaceState(null, '', url);
    } catch {
      location.hash = next;
    }
  }

  function activatePage(id, stateId, opts = {}) {
    const page = pages.find(p => p.id === id);
    if (!page) return;
    st.pageId = id;
    st.stateId = stateId && page.states.some(s => s.id === stateId)
      ? stateId
      : page.states[0].id;
    buildNav();
    buildToolbar(page);
    loadPage(page, st.stateId);
    if (!opts.skipHash) syncHash();
  }

  function activateState(id, opts = {}) {
    const page = pages.find(p => p.id === st.pageId);
    if (!page || !page.states.some(s => s.id === id)) return;
    st.stateId = id;
    buildToolbar(page);
    loadPage(page, id);
    if (!opts.skipHash) syncHash();
  }

  function setDevice(id) {
    st.device = id;
    const vp  = $('mn-viewport');
    vp.className = `mn-viewport mn-${id}`;

    for (const btn of document.querySelectorAll('.mn-dev-btn')) {
      btn.classList.toggle('mn-active', btn.dataset.device === id);
    }
  }

  // ─── boot ─────────────────────────────────────────────────────────────────────

  function mount(userCfg) {
    cfg   = userCfg;
    pages = normalise(userCfg.pages ?? []);

    // inject styles
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // mount shell
    const shell = document.createElement('div');
    shell.className = 'mn-shell';
    shell.innerHTML = HTML;
    document.body.appendChild(shell);

    // fill static text
    $('mn-name').textContent  = userCfg.title ?? 'MockNav';
    $('mn-count').textContent = pages.length;

    // search
    $('mn-search').addEventListener('input', e => {
      st.query = e.target.value;
      buildNav();
    });

    // device buttons
    for (const btn of document.querySelectorAll('.mn-dev-btn')) {
      btn.addEventListener('click', () => setDevice(btn.dataset.device));
    }

    buildNav();

    window.addEventListener('hashchange', () => {
      const route = readRoute();
      if (!route) return;
      const page = pages.find(p => p.id === route.pageId);
      if (!page) return;
      const routeState = route.stateId && page.states.some(s => s.id === route.stateId)
        ? route.stateId
        : page.states[0].id;
      if (route.pageId === st.pageId && routeState === st.stateId) return;
      activatePage(route.pageId, route.stateId, { skipHash: true });
    });

    const route = readRoute();
    if (route && pages.some(p => p.id === route.pageId)) {
      activatePage(route.pageId, route.stateId, { skipHash: true });
    } else if (pages.length) {
      activatePage(pages[0].id);
    }
  }

  // ─── public api ──────────────────────────────────────────────────────────────

  window.MockNav = {
    init: mount,
    go:   activatePage,
  };

})();
