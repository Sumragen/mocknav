/*!
 * sp-mocknav.js — v1.0.0
 * StoryPath mockup navigator.
 * Iframe-based (scripts run natively), link-intercepting, keyboard-driven.
 * MIT License
 */

(function () {
  'use strict';

  // ─── css ─────────────────────────────────────────────────────────────────────

  const CSS = `
    .mn-shell {
      --mn-sidebar: 220px;
      --mn-bar: 44px;
      --mn-bg0: #ffffff;
      --mn-bg1: #f5f4f1;
      --mn-bg2: #eceae6;
      --mn-bg3: #e2dfda;
      --mn-bd:  rgba(0,0,0,.09);
      --mn-bd2: rgba(0,0,0,.15);
      --mn-tx0: #181816;
      --mn-tx1: #5c5c58;
      --mn-tx2: #9a9a95;
      --mn-acc: #1a6ef5;
      --mn-acc-bg: #eaf0fe;
      --mn-red: #e24b4a;
      --mn-green: #2d9a4e;
      --mn-amber: #d08a0e;
      --mn-blue: #5b8fc9;
      --mn-purple: #7b5cf5;

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
      transition: width .2s ease, opacity .2s ease;
    }
    .mn-sidebar.mn-collapsed {
      width: 0;
      opacity: 0;
      pointer-events: none;
    }

    .mn-sidebar-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
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
      padding: 1px 6px;
      border-radius: 99px;
      flex-shrink: 0;
    }

    .mn-search-wrap {
      padding: 6px 8px;
      border-bottom: 1px solid var(--mn-bd);
      flex-shrink: 0;
    }
    .mn-search {
      padding: 5px 9px;
      font: 12px/1 -apple-system, 'Segoe UI', system-ui, sans-serif;
      background: var(--mn-bg1);
      border: 1px solid var(--mn-bd);
      border-radius: 6px;
      color: var(--mn-tx0);
      outline: none;
      width: 100%;
      -webkit-appearance: none;
    }
    .mn-search::placeholder { color: var(--mn-tx2); }
    .mn-search:focus { border-color: var(--mn-acc); background: var(--mn-bg0); }

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
      padding: 10px 8px 3px;
      user-select: none;
    }

    .mn-item {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 5px 8px;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid transparent;
      margin-bottom: 1px;
      user-select: none;
      color: var(--mn-tx0);
    }
    .mn-item:hover { background: var(--mn-bg1); }
    .mn-item.mn-active {
      background: var(--mn-bg2);
      border-color: var(--mn-bd2);
    }
    .mn-item-name {
      flex: 1;
      font-size: 12.5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mn-dots { display: flex; gap: 3px; align-items: center; }
    .mn-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--mn-tx2);
      flex-shrink: 0;
    }
    .mn-dot[data-s="error"]   { background: var(--mn-red); }
    .mn-dot[data-s="success"] { background: var(--mn-green); }
    .mn-dot[data-s="loading"] { background: var(--mn-amber); }
    .mn-dot[data-s="empty"]   { background: var(--mn-blue); }
    .mn-dot[data-s="active"]  { background: var(--mn-purple); }
    .mn-dot[data-s="hover"]   { background: var(--mn-acc); }

    .mn-badge {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
      padding: 1px 5px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .mn-badge-new    { background: #dff7e6; color: #1a7a3a; }
    .mn-badge-wip    { background: #fff3d6; color: #7a5000; }
    .mn-badge-done   { background: #e3edfe; color: #1a50c8; }
    .mn-badge-review { background: #fde3ef; color: #a0195a; }

    .mn-empty-search {
      padding: 20px 12px;
      text-align: center;
      color: var(--mn-tx2);
      font-size: 12px;
    }

    .mn-sidebar-foot {
      border-top: 1px solid var(--mn-bd);
      padding: 0 12px;
      height: 30px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    .mn-footer-text {
      font-size: 10px;
      color: var(--mn-tx2);
      letter-spacing: .04em;
    }

    /* ── main ── */

    .mn-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }

    /* ── toolbar ── */

    .mn-toolbar {
      height: var(--mn-bar);
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      border-bottom: 1px solid var(--mn-bd);
      background: var(--mn-bg0);
      flex-shrink: 0;
      overflow: hidden;
    }

    .mn-toggle-sidebar {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: 1px solid var(--mn-bd);
      background: transparent;
      color: var(--mn-tx1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: background .15s;
    }
    .mn-toggle-sidebar:hover { background: var(--mn-bg2); }

    .mn-toolbar-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--mn-tx0);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
      flex-shrink: 0;
    }

    .mn-sep {
      width: 1px;
      height: 18px;
      background: var(--mn-bd);
      flex-shrink: 0;
    }

    .mn-states {
      display: flex;
      gap: 3px;
      flex: 1;
      overflow-x: auto;
      scrollbar-width: none;
      align-items: center;
    }
    .mn-states::-webkit-scrollbar { display: none; }

    .mn-state-btn {
      padding: 3px 10px;
      border-radius: 5px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--mn-tx1);
      font: 12px/1.5 -apple-system, 'Segoe UI', system-ui, sans-serif;
      cursor: pointer;
      white-space: nowrap;
      transition: all .12s;
    }
    .mn-state-btn:hover { background: var(--mn-bg2); color: var(--mn-tx0); }
    .mn-state-btn.mn-active {
      background: var(--mn-acc-bg);
      border-color: color-mix(in srgb, var(--mn-acc) 40%, transparent);
      color: var(--mn-acc);
      font-weight: 600;
    }

    .mn-actions {
      display: flex;
      gap: 3px;
      align-items: center;
      flex-shrink: 0;
    }

    .mn-devices {
      display: flex;
      gap: 2px;
      align-items: center;
      flex-shrink: 0;
    }

    .mn-dev-btn, .mn-action-btn {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--mn-tx1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      transition: all .12s;
    }
    .mn-dev-btn:hover, .mn-action-btn:hover {
      background: var(--mn-bg2);
      color: var(--mn-tx0);
    }
    .mn-dev-btn.mn-active {
      background: var(--mn-acc-bg);
      border-color: color-mix(in srgb, var(--mn-acc) 40%, transparent);
      color: var(--mn-acc);
    }
    .mn-action-btn[title]:hover::after {
      content: attr(title);
      position: absolute;
      top: calc(var(--mn-bar) + 4px);
      right: 4px;
      background: var(--mn-tx0);
      color: var(--mn-bg0);
      font-size: 11px;
      padding: 3px 7px;
      border-radius: 5px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 10;
    }

    /* ── stage + viewport ── */

    .mn-stage {
      flex: 1;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      overflow: auto;
      background: var(--mn-bg2);
      /* Subtle dot grid */
      background-image: radial-gradient(circle, var(--mn-bd2) 1px, transparent 1px);
      background-size: 20px 20px;
      position: relative;
    }

    /* ── viewport base ── */
    .mn-viewport {
      display: flex;
      flex-direction: column;
      background: #fff;
      position: relative;
      overflow: hidden;
    }

    /* Desktop: browser window with macOS-style chrome */
    .mn-viewport.mn-desktop {
      flex: none;
      width: calc(100% - 48px);
      max-width: 1440px;
      min-height: calc(100vh - 44px - 26px - 48px); /* stage minus toolbar/statusbar/margins */
      margin: 24px auto;
      border-radius: 10px;
      box-shadow: 0 0 0 1px var(--mn-bd2), 0 16px 48px rgba(0,0,0,.22);
    }
    .mn-viewport.mn-desktop::before {
      content: '';
      display: block;
      flex-shrink: 0;
      height: 38px;
      border-bottom: 1px solid var(--mn-bd);
      background-color: var(--mn-bg2);
      /* Traffic lights + URL bar */
      background-image:
        radial-gradient(circle 5px at 14px 50%, #ff5f57, #ff5f57),
        radial-gradient(circle 5px at 28px 50%, #febc2e, #febc2e),
        radial-gradient(circle 5px at 42px 50%, #28c840, #28c840),
        linear-gradient(var(--mn-bg0) 0%, var(--mn-bg0) 100%);
      background-repeat: no-repeat;
      background-size: 10px 10px, 10px 10px, 10px 10px, 38% 22px;
      background-position: 9px 50%, 23px 50%, 37px 50%, center 50%;
    }

    /* Tablet: centred card */
    .mn-viewport.mn-tablet {
      flex: none;
      width: 768px;
      height: 946px;
      margin: 24px auto;
      border-radius: 10px;
      box-shadow: 0 0 0 1px var(--mn-bd2), 0 8px 32px rgba(0,0,0,.18);
    }

    /* Mobile: iPhone shell — 393×852 (iPhone 15/16 logical px) */
    .mn-viewport.mn-mobile {
      flex: none;
      width: 393px;
      height: 852px;
      margin: 24px auto;
      border-radius: 50px;
      box-shadow:
        0 0 0 10px #1c1c1e,
        0 0 0 11px #3a3a3c,
        0 24px 64px rgba(0,0,0,.55);
      overflow: hidden;
      flex-shrink: 0;
    }
    /* Dynamic island */
    .mn-viewport.mn-mobile::before {
      content: '';
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 34px;
      background: #1c1c1e;
      border-radius: 20px;
      z-index: 2;
      pointer-events: none;
    }
    /* Home indicator bar */
    .mn-viewport.mn-mobile::after {
      content: '';
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 134px;
      height: 5px;
      background: rgba(0,0,0,.3);
      border-radius: 3px;
      z-index: 2;
      pointer-events: none;
    }
    .mn-viewport.mn-mobile .mn-frame {
      height: 852px;
    }

    .mn-frame {
      border: none;
      flex: 1;
      width: 100%;
      min-height: 400px;
      display: block;
    }

    /* ── status bar ── */

    .mn-statusbar {
      height: 26px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 12px;
      border-top: 1px solid var(--mn-bd);
      background: var(--mn-bg0);
      flex-shrink: 0;
      overflow: hidden;
    }
    .mn-status-path {
      font-size: 11px;
      color: var(--mn-tx2);
      font-family: ui-monospace, 'Cascadia Code', monospace;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
    .mn-open-link {
      font-size: 11px;
      color: var(--mn-acc);
      text-decoration: none;
      padding: 1px 6px;
      border-radius: 4px;
      border: 1px solid var(--mn-bd);
      white-space: nowrap;
      flex-shrink: 0;
      transition: background .12s;
    }
    .mn-open-link:hover { background: var(--mn-acc-bg); }
    .mn-open-link[hidden] { display: none; }

    /* ── notices ── */

    .mn-notice {
      position: absolute;
      bottom: 36px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--mn-tx0);
      color: var(--mn-bg0);
      font-size: 12px;
      padding: 6px 14px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,.2);
      white-space: nowrap;
      z-index: 10;
      pointer-events: none;
    }

    .mn-error-box {
      padding: 32px;
      color: var(--mn-red);
      font-size: 13px;
      line-height: 1.6;
    }
    .mn-error-box code {
      font-family: ui-monospace, monospace;
      font-size: 12px;
    }

    .mn-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      height: 100%;
      color: var(--mn-tx2);
      font-size: 13px;
      min-height: 200px;
    }

    /* ── toast ── */

    .mn-toast {
      position: fixed;
      bottom: 36px;
      left: 50%;
      transform: translateX(-50%) translateY(0);
      background: var(--mn-tx0);
      color: var(--mn-bg0);
      font: 12px/1 -apple-system, 'Segoe UI', system-ui, sans-serif;
      padding: 7px 14px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,.25);
      z-index: 1000000;
      pointer-events: none;
      opacity: 0;
      transition: opacity .2s, transform .2s;
      white-space: nowrap;
    }
    .mn-toast.mn-show {
      opacity: 1;
    }

    /* ── keyboard hint ── */

    .mn-kbd-hint {
      font-size: 10px;
      color: var(--mn-tx2);
      background: var(--mn-bg2);
      border: 1px solid var(--mn-bd2);
      border-radius: 3px;
      padding: 1px 5px;
      font-family: ui-monospace, monospace;
    }
  `;

  // ─── html skeleton ─────────────────────────────────────────────────────────────

  const HTML = `
    <div class="mn-sidebar" id="mn-sidebar">
      <div class="mn-sidebar-head">
        <span class="mn-project-name" id="mn-name"></span>
        <span class="mn-count" id="mn-count"></span>
      </div>
      <div class="mn-search-wrap">
        <input class="mn-search" id="mn-search" type="search" placeholder="Search… (⌘K)" autocomplete="off">
      </div>
      <nav class="mn-nav" id="mn-nav"></nav>
      <div class="mn-sidebar-foot">
        <span class="mn-footer-text">sp-mocknav</span>
      </div>
    </div>

    <div class="mn-main">
      <div class="mn-toolbar">
        <button class="mn-toggle-sidebar" id="mn-toggle-sidebar" title="Toggle sidebar (B)">☰</button>
        <div class="mn-sep"></div>
        <span class="mn-toolbar-title" id="mn-title">—</span>
        <div class="mn-sep"></div>
        <div class="mn-states" id="mn-states"></div>
        <div class="mn-sep"></div>
        <div class="mn-devices">
          <button class="mn-dev-btn mn-active" data-device="desktop" title="Desktop (D)">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          </button>
          <button class="mn-dev-btn" data-device="tablet" title="Tablet (T)">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>
          </button>
          <button class="mn-dev-btn" data-device="mobile" title="Mobile (M)">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>
          </button>
        </div>
        <div class="mn-sep"></div>
        <div class="mn-actions">
          <button class="mn-action-btn" id="mn-btn-reload" title="Reload (R)">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
          </button>
          <button class="mn-action-btn" id="mn-btn-copy" title="Copy link">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <a class="mn-open-link" id="mn-open" target="_blank" hidden>↗ open</a>
        </div>
      </div>

      <div class="mn-stage" id="mn-stage">
        <div class="mn-viewport mn-desktop" id="mn-viewport">
          <div class="mn-placeholder" id="mn-placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
            Select a page from the sidebar
          </div>
        </div>
      </div>

      <div class="mn-statusbar">
        <span class="mn-status-path" id="mn-path"></span>
      </div>
    </div>

    <div class="mn-toast" id="mn-toast"></div>
  `;

  // ─── state ───────────────────────────────────────────────────────────────────

  let cfg   = {};
  let pages = [];
  const st  = { pageId: null, stateId: null, device: 'desktop', query: '', sidebarOpen: true };

  const $ = id => document.getElementById(id);

  // ─── normalise config ────────────────────────────────────────────────────────

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

    let lastGroup = null;
    for (const p of list) {
      if (p.group !== lastGroup) {
        const g = document.createElement('div');
        g.className   = 'mn-group';
        g.textContent = p.group;
        nav.appendChild(g);
        lastGroup = p.group;
      }

      const item = document.createElement('div');
      item.className = 'mn-item' + (p.id === st.pageId ? ' mn-active' : '');
      item.setAttribute('data-id', p.id);
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('title', p.name);

      // name
      const name = document.createElement('span');
      name.className   = 'mn-item-name';
      name.textContent = p.name;
      item.appendChild(name);

      // state dots (up to 4)
      if (p.states.length > 1) {
        const dots = document.createElement('span');
        dots.className = 'mn-dots';
        const shown = p.states.slice(0, 4);
        for (const s of shown) {
          const d = document.createElement('span');
          d.className = 'mn-dot';
          // Infer a colour from common state-id keywords
          if (/error|fail/i.test(s.id))       d.dataset.s = 'error';
          else if (/success|done|complete/i.test(s.id)) d.dataset.s = 'success';
          else if (/loading|process/i.test(s.id))  d.dataset.s = 'loading';
          else if (/empty|new/i.test(s.id))    d.dataset.s = 'empty';
          else if (/active|premium/i.test(s.id)) d.dataset.s = 'active';
          dots.appendChild(d);
        }
        item.appendChild(dots);
      }

      // badge
      if (p.badge) {
        const b = document.createElement('span');
        b.className   = `mn-badge mn-badge-${p.badge}`;
        b.textContent = p.badge;
        item.appendChild(b);
      }

      item.addEventListener('click', () => activatePage(p.id));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activatePage(p.id); }
      });
      nav.appendChild(item);
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
      btn.title       = `State: ${s.id}`;
      btn.addEventListener('click', () => activateState(s.id));
      wrap.appendChild(btn);
    }
  }

  // ─── iframe loading ──────────────────────────────────────────────────────────

  /** Build the URL for a given page + state. */
  function resolveFile(page, stateId) {
    // If the state has its own file, use it
    const s = page.states.find(s => s.id === stateId);
    if (s?.file) return s.file;

    // default state → no ?state= param (avoids triggering state-default CSS class)
    if (!stateId || stateId === 'default') return page.file;

    return `${page.file}?state=${encodeURIComponent(stateId)}`;
  }

  /**
   * Inject a tiny link-interceptor into the iframe after it loads.
   * Intercepts clicks on <a href="*.html"> and posts them to the parent
   * so MockNav can navigate to that page instead of leaving the shell.
   */
  function injectLinkInterceptor(frame) {
    try {
      const doc = frame.contentDocument;
      if (!doc || !doc.body) return;
      if (doc.getElementById('__mn_li')) return; // already injected

      const s = doc.createElement('script');
      s.id          = '__mn_li';
      s.textContent = `
        (function(){
          if(window.__mnLI) return;
          window.__mnLI = true;

          // ── Link interception ──────────────────────────────────────
          document.addEventListener('click', function(e){
            var a = e.target.closest('a[href]');
            if(!a) return;
            var href = a.getAttribute('href');
            if(!href) return;
            var first = href.charAt(0);
            if(first === '#') return;
            if(href.indexOf('://') !== -1) return;
            if(first === '?' || href.match(/^(mailto|tel|javascript):/)) return;
            e.preventDefault();
            e.stopPropagation();
            window.parent.postMessage({type:'mn-nav',href:href},'*');
          }, true);

          // ── State notification helper ──────────────────────────────
          // Defined on the iframe's own window so templates call it
          // without needing to traverse window.parent.
          window.mnNotifyState = function(stateId) {
            window.parent.postMessage({type:'mn-state', stateId: stateId}, '*');
          };

          // ── Fallback: watch body.classList for state-* changes ─────
          // Catches the ?state= handler adding state-X to body.
          new MutationObserver(function(muts) {
            for (var m of muts) {
              var cls = Array.prototype.find
                ? Array.prototype.find.call(document.body.classList, function(c){ return c.startsWith('state-'); })
                : (function(){ for(var i=0;i<document.body.classList.length;i++){ if(document.body.classList[i].startsWith('state-')) return document.body.classList[i]; } })();
              if (cls) {
                window.parent.postMessage({type:'mn-state', stateId: cls.slice(6)}, '*');
                break;
              }
            }
          }).observe(document.body, {attributes:true, attributeFilter:['class']});
        })();
      `;
      (doc.head || doc.body).appendChild(s);
    } catch (_) {
      // Cross-origin or browser restriction — silently ignore
    }
  }

  /** Create or reuse the single iframe inside the viewport. */
  function getOrCreateFrame(viewport) {
    let frame = viewport.querySelector('.mn-frame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.className = 'mn-frame';
      frame.id        = 'mn-frame';
      viewport.appendChild(frame);
    }
    return frame;
  }

  function loadPage(page, stateId) {
    const file = resolveFile(page, stateId);

    // Status bar
    $('mn-path').textContent = file;
    const link = $('mn-open');
    link.href   = file;
    link.hidden = false;

    // Remove placeholder
    const ph = $('mn-placeholder');
    if (ph) ph.remove();

    const viewport = $('mn-viewport');
    const frame    = getOrCreateFrame(viewport);

    frame.src = file;

    frame.onload = () => {
      injectLinkInterceptor(frame);
    };
  }

  // ─── link interception ───────────────────────────────────────────────────────

  window.addEventListener('message', function (e) {
    if (!e.data) return;
    if (e.data.type === 'mn-nav')   handleInternalLink(e.data.href);
    if (e.data.type === 'mn-state') handleStateChange(e.data.stateId);
  });

  /** Called when the iframe notifies us that the mockup changed state via user interaction. */
  function handleStateChange(stateId) {
    const page = pages.find(p => p.id === st.pageId);
    if (!page) return;
    if (!page.states.some(s => s.id === stateId)) return;
    if (st.stateId === stateId) return; // already in sync
    st.stateId = stateId;
    buildToolbar(page);
    syncHash();
  }

  function handleInternalLink(href) {
    // Resolve relative to current frame src
    const frame = $('mn-frame');
    const base  = frame ? frame.src : location.href;

    let url;
    try { url = new URL(href, base); } catch (_) { return; }

    const filename  = url.pathname.split('/').pop();
    const stateHint = url.searchParams.get('state');

    // Find matching page by filename
    for (const page of pages) {
      const pageFile = page.file.split('/').pop().split('?')[0];
      if (pageFile === filename) {
        const targetState = stateHint && page.states.some(s => s.id === stateHint)
          ? stateHint
          : page.states[0].id;
        activatePage(page.id, targetState);
        return;
      }
    }

    // If no page found in the config, open in new tab as fallback
    window.open(url.href, '_blank');
  }

  // ─── device ──────────────────────────────────────────────────────────────────

  function setDevice(id) {
    st.device = id;
    const vp  = $('mn-viewport');
    vp.className = `mn-viewport mn-${id}`;

    for (const btn of document.querySelectorAll('.mn-dev-btn')) {
      btn.classList.toggle('mn-active', btn.dataset.device === id);
    }
  }

  // ─── actions ─────────────────────────────────────────────────────────────────

  function readRoute() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (!parts.length) return null;
    return {
      pageId:  decodeURIComponent(parts[0]),
      stateId: parts[1] ? decodeURIComponent(parts[1]) : null,
    };
  }

  function syncHash() {
    if (!st.pageId) return;
    const next = `#${encodeURIComponent(st.pageId)}/${encodeURIComponent(st.stateId)}`;
    if (location.hash === next) return;
    try {
      history.replaceState(null, '', location.pathname + location.search + next);
    } catch (_) {
      location.hash = next;
    }
  }

  function activatePage(id, stateId, opts = {}) {
    const page = pages.find(p => p.id === id);
    if (!page) return;

    st.pageId  = id;
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

  function reloadCurrent() {
    const frame = $('mn-frame');
    if (frame) {
      frame.src = frame.src; // triggers reload
    }
  }

  function copyLink() {
    const frame = $('mn-frame');
    if (!frame || !frame.src) return;
    try {
      navigator.clipboard.writeText(frame.src);
      showToast('Link copied!');
    } catch (_) {
      showToast(frame.src);
    }
  }

  // ─── toast ───────────────────────────────────────────────────────────────────

  let toastTimer;
  function showToast(msg) {
    const t = $('mn-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('mn-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('mn-show'), 1800);
  }

  // ─── keyboard shortcuts ──────────────────────────────────────────────────────

  function setupKeyboard() {
    document.addEventListener('keydown', function (e) {
      const tag    = document.activeElement?.tagName ?? '';
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA';

      // ⌘K / Ctrl+K — focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        $('mn-search').focus();
        return;
      }

      if (inInput) return;

      // B — toggle sidebar
      if (e.key === 'b' || e.key === 'B') {
        toggleSidebar();
        return;
      }

      // R — reload
      if (e.key === 'r' || e.key === 'R') {
        reloadCurrent();
        return;
      }

      // D / T / M — devices
      if (e.key === 'd' || e.key === 'D') { setDevice('desktop'); return; }
      if (e.key === 't' || e.key === 'T') { setDevice('tablet');  return; }
      if (e.key === 'm' || e.key === 'M') { setDevice('mobile');  return; }

      // ← → — prev/next state
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const page = pages.find(p => p.id === st.pageId);
        if (!page || page.states.length < 2) return;
        const idx     = page.states.findIndex(s => s.id === st.stateId);
        const nextIdx = e.key === 'ArrowRight'
          ? (idx + 1) % page.states.length
          : (idx - 1 + page.states.length) % page.states.length;
        activateState(page.states[nextIdx].id);
        return;
      }

      // ↑ ↓ — prev/next page
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const idx     = pages.findIndex(p => p.id === st.pageId);
        if (idx === -1) return;
        const nextIdx = e.key === 'ArrowDown'
          ? Math.min(idx + 1, pages.length - 1)
          : Math.max(idx - 1, 0);
        if (nextIdx !== idx) activatePage(pages[nextIdx].id);
        return;
      }

      // 1-9 — jump to page by number
      if (e.key >= '1' && e.key <= '9') {
        const i = parseInt(e.key, 10) - 1;
        if (pages[i]) activatePage(pages[i].id);
        return;
      }
    });
  }

  // ─── sidebar toggle ──────────────────────────────────────────────────────────

  function toggleSidebar() {
    st.sidebarOpen = !st.sidebarOpen;
    $('mn-sidebar').classList.toggle('mn-collapsed', !st.sidebarOpen);
  }

  // ─── boot ────────────────────────────────────────────────────────────────────

  function mount(userCfg) {
    cfg   = userCfg;
    pages = normalise(userCfg.pages ?? []);

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Mount shell
    const shell = document.createElement('div');
    shell.className = 'mn-shell';
    shell.innerHTML = HTML;
    document.body.appendChild(shell);

    // Static text
    $('mn-name').textContent  = userCfg.title ?? 'MockNav';
    $('mn-count').textContent = pages.length;

    // Search
    $('mn-search').addEventListener('input', e => {
      st.query = e.target.value;
      buildNav();
    });
    $('mn-search').addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.target.blur(); e.target.value = ''; st.query = ''; buildNav(); }
    });

    // Device buttons
    for (const btn of document.querySelectorAll('.mn-dev-btn')) {
      btn.addEventListener('click', () => setDevice(btn.dataset.device));
    }

    // Sidebar toggle
    $('mn-toggle-sidebar').addEventListener('click', toggleSidebar);

    // Reload
    $('mn-btn-reload').addEventListener('click', reloadCurrent);

    // Copy link
    $('mn-btn-copy').addEventListener('click', copyLink);

    buildNav();
    setupKeyboard();

    // Hash-based routing
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

    // Initial page from hash or first page
    const route = readRoute();
    if (route && pages.some(p => p.id === route.pageId)) {
      activatePage(route.pageId, route.stateId, { skipHash: true });
    } else if (pages.length) {
      activatePage(pages[0].id);
    }
  }

  // ─── public api ──────────────────────────────────────────────────────────────

  window.MockNav = {
    init:         mount,
    go:           activatePage,
    /** Called from inside the iframe to sync state UI without reloading. */
    notifyState:  handleStateChange,
    setState:     activateState,
    reload:       reloadCurrent,
    setDevice,
  };

})();
