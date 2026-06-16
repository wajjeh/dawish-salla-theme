(function () {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function hideLoader() {
    const loader = qs('#dawish-loader');
    if (!loader) return;
    loader.classList.add('is-hidden');
    setTimeout(() => loader.remove(), 700);
  }

  window.addEventListener('load', () => setTimeout(hideLoader, 250));
  setTimeout(hideLoader, Number(window.dawishTheme?.loaderTimeout || 2500));

  function initHeader() {
    const header = qs('#dawish-header');
    if (!header) return;
    if (window.dawishTheme?.stickyHeader) header.classList.add('is-sticky');
  }

  function initSearch() {
    const overlay = qs('#dawish-search-overlay');
    if (!overlay) return;

    const input = qs('#dawish-search-input');
    const openers = qsa('[data-dawish-open-search]');
    const closers = qsa('[data-dawish-close-search]');

    const open = () => {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input && input.focus(), 120);
    };

    const close = () => {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    openers.forEach(btn => btn.addEventListener('click', open));
    closers.forEach(btn => btn.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }

  function initMobileMenu() {
    const menu = qs('#dawish-mobile-menu');
    const openBtn = qs('[data-dawish-menu-toggle]');
    const closeBtn = qs('[data-dawish-menu-close]');
    if (!menu || !openBtn) return;

    const open = () => {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) close();
    });
  }

  function initCartAnimation() {
    if (!window.salla?.cart?.event) return;
    salla.cart.event.onUpdated(summary => {
      qsa('[data-cart-count]').forEach(el => { el.textContent = salla.helpers?.number ? salla.helpers.number(summary.count) : summary.count; });
    });
  }

  const boot = () => {
    initHeader();
    initSearch();
    initMobileMenu();
    initCartAnimation();
    document.dispatchEvent(new CustomEvent('dawish::ready'));
  };

  if (window.salla?.onReady) {
    salla.onReady(boot);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
