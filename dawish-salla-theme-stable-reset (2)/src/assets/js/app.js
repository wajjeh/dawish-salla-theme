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

  function initLoader() {
    window.addEventListener('load', () => setTimeout(hideLoader, 250));
    setTimeout(hideLoader, Number(window.dawishTheme?.loaderTimeout || 2500));
  }

  function initHeader() {
    const header = qs('#dawish-header');
    if (!header) return;
    if (window.dawishTheme?.stickyHeader) header.classList.add('is-sticky');

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
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
    qsa('a', menu).forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) close();
    });
  }

  function initFloatingActions() {
    const topButton = qs('[data-dawish-scroll-top]');
    if (!topButton) return;

    const toggle = () => {
      topButton.classList.toggle('is-visible', window.scrollY > 480);
    };

    topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }

  function initCartAnimation() {
    if (!window.salla?.cart?.event) return;

    const updateCount = summary => {
      if (!summary || typeof summary.count === 'undefined') return;
      qsa('[data-cart-count]').forEach(el => {
        el.textContent = salla.helpers?.number ? salla.helpers.number(summary.count) : summary.count;
      });
    };

    try {
      salla.cart.event.onUpdated(updateCount);
    } catch (error) {
      // Keep theme safe if the event API changes.
    }
  }

  function initProductImagePolish() {
    qsa('.dawish-product-single__gallery img').forEach(img => {
      img.loading = img.loading || 'lazy';
      img.decoding = img.decoding || 'async';
    });
  }


  function initPageContextClasses() {
    const path = window.location.pathname || '';
    if (qs('.dawish-product-page') || /\/p\//.test(path) || /\/product/.test(path)) {
      document.body.classList.add('dawish-product-view');
    }
    if (qs('.dawish-cart-page') || /\/cart/.test(path)) {
      document.body.classList.add('dawish-cart-view');
    }
    if (/checkout|order|payment|address|shipping/i.test(path) || qs('salla-checkout') || qs('[class*="checkout" i]')) {
      document.body.classList.add('dawish-checkout-view');
    }
  }

  const dawishVariantStyle = `
    .dawish-size-choice{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;min-height:78px!important;padding:14px 12px!important;border:1.5px solid rgba(104,116,76,.22)!important;background:#fff!important;border-radius:18px!important;box-shadow:0 8px 22px rgba(32,27,22,.045)!important;transition:border-color .18s ease,background .18s ease,box-shadow .18s ease,transform .18s ease!important;overflow:hidden!important;cursor:pointer!important}
    .dawish-size-choice:hover{transform:translateY(-2px)!important;border-color:rgba(104,116,76,.55)!important;box-shadow:0 14px 30px rgba(32,27,22,.08)!important}
    .dawish-size-choice.is-selected,.dawish-size-choice:has(input:checked),.dawish-size-choice[aria-checked="true"]{border-color:#68744c!important;background:#f2f6ec!important;box-shadow:0 0 0 3px rgba(104,116,76,.13),0 14px 30px rgba(32,27,22,.08)!important}
    .dawish-size-choice.is-selected:after,.dawish-size-choice:has(input:checked):after,.dawish-size-choice[aria-checked="true"]:after{content:"✓";position:absolute;top:9px;inset-inline-end:9px;width:24px;height:24px;border-radius:999px;background:#68744c;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:1000}
    .dawish-size-choice img{display:none!important}.dawish-size-choice input{position:absolute!important;opacity:0!important;pointer-events:none!important}
    .dawish-size-badge{position:absolute;top:8px;inset-inline-start:8px;background:#c2a15a;color:#fff;border-radius:999px;font-size:10px;font-weight:1000;padding:4px 7px;line-height:1}
    .dawish-size-label{font-size:16px;font-weight:1000;color:#1f242f;line-height:1.35}.dawish-size-price{display:block;margin-top:5px;color:#b84032;font-size:13px;font-weight:1000}
    .dawish-size-choice.is-disabled,.dawish-size-choice[disabled],.dawish-size-choice[aria-disabled="true"]{opacity:.48;filter:grayscale(1);cursor:not-allowed;pointer-events:none}
  `;

  function getOpenRoots() {
    const roots = [document];
    qsa('*').forEach(el => {
      if (el.shadowRoot) roots.push(el.shadowRoot);
    });
    return roots;
  }

  function injectVariantStyle(root) {
    if (!root || !root.host) return;
    if (root.querySelector('[data-dawish-variant-style]')) return;
    const style = document.createElement('style');
    style.setAttribute('data-dawish-variant-style', 'true');
    style.textContent = dawishVariantStyle;
    root.appendChild(style);
  }

  function cleanOptionText(text) {
    return (text || '')
      .replace(/\s+/g, ' ')
      .replace(/اضف|إضافة|للسلة|متوفر|غير متوفر/g, '')
      .trim();
  }

  function looksLikeSize(text) {
    return /\b(\d+|[٠-٩]+)\s*(جرام|جم|غرام|غ|كيس|أكياس|كيلو|مل|ملي|لتر|حبة|علبة|عبوة)\b/i.test(text || '') || /اختر حجم|الحجم|حجم/i.test(text || '');
  }

  function addBadge(card, text) {
    if (!card || card.querySelector('.dawish-size-badge')) return;
    const normalized = (text || '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    let badge = '';
    if (/300|500|1000|كيلو/i.test(normalized)) badge = 'أفضل قيمة';
    else if (/220|250|200/i.test(normalized)) badge = 'الأكثر طلبًا';
    if (!badge) return;
    const el = document.createElement('span');
    el.className = 'dawish-size-badge';
    el.textContent = badge;
    card.appendChild(el);
  }

  function enhanceChoice(card) {
    if (!card) return;
    const checked = card.matches('[aria-checked="true"]') || !!card.querySelector('input:checked') || card.className.includes('selected') || card.className.includes('checked');
    if (card.dataset.dawishEnhanced === 'true') {
      card.classList.toggle('is-selected', checked);
      return;
    }

    const text = cleanOptionText(card.textContent);
    if (!looksLikeSize(text)) return;

    card.classList.add('dawish-size-choice');
    card.dataset.dawishEnhanced = 'true';
    card.classList.toggle('is-selected', checked);

    qsa('img', card).forEach(img => {
      img.setAttribute('aria-hidden', 'true');
      img.loading = 'lazy';
    });

    // Keep Salla's original inputs and internal click handlers intact.
    // We only add classes/badges and let CSS simplify the presentation.
    card.setAttribute('title', text);
    addBadge(card, text);
  }

  function enhanceRootOptions(root) {
    if (!root) return;
    if (root.host) injectVariantStyle(root);

    const candidates = [
      'label',
      '[role="radio"]',
      '[aria-checked]',
      '.s-product-options-option',
      '.s-product-options-option-content',
      '.s-product-options__item',
      '.s-product-options-item',
      '[class*="option-item"]',
      '[class*="option_value"]',
      '[class*="option-value"]'
    ].join(',');

    qsa(candidates, root).forEach(enhanceChoice);
  }

  function updateSelectedOptionNote() {
    const shell = qs('[data-dawish-option-shell]');
    const note = qs('[data-dawish-selected-option-note]');
    const sticky = qs('[data-dawish-sticky-option]');
    if (!shell || !note) return;

    let selectedText = '';
    const roots = getOpenRoots();
    for (const root of roots) {
      const selected = qs('.dawish-size-choice.is-selected, .dawish-size-choice:has(input:checked), .dawish-size-choice[aria-checked="true"]', root);
      if (selected) {
        selectedText = cleanOptionText(selected.textContent);
        break;
      }
    }

    if (!selectedText) {
      const checked = qs('[data-dawish-option-shell] input:checked');
      selectedText = checked ? cleanOptionText(checked.closest('label')?.textContent || checked.value) : '';
    }

    if (selectedText) {
      note.classList.add('is-selected');
      note.innerHTML = '<i class="sicon-check-circle"></i> تم اختيار: <strong>' + selectedText + '</strong>';
      if (sticky) sticky.textContent = 'تم اختيار: ' + selectedText;
    } else {
      note.classList.remove('is-selected');
      note.innerHTML = '<i class="sicon-check-circle"></i> اختر الحجم لإظهار الاختيار قبل الإضافة للسلة';
      if (sticky) sticky.textContent = 'اختر الحجم ثم أضف للسلة';
    }
  }

  function initVariantOptionsPolish() {
    const shell = qs('[data-dawish-option-shell]');
    if (!shell) return;

    const run = () => {
      getOpenRoots().forEach(enhanceRootOptions);
      updateSelectedOptionNote();
    };

    run();
    [250, 700, 1400, 2600].forEach(delay => setTimeout(run, delay));

    const observer = new MutationObserver(() => run());
    observer.observe(shell, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-checked', 'checked'] });

    shell.addEventListener('click', () => setTimeout(run, 60));
    shell.addEventListener('change', () => setTimeout(run, 60));
    document.addEventListener('salla::product::updated', run);
    document.addEventListener('salla:product:options:changed', run);
  }

  function initCartAndCheckoutPolish() {
    const run = () => {
      initPageContextClasses();
      qsa('.dawish-cart-page input[placeholder], .dawish-cart-page input').forEach(input => {
        const placeholder = input.getAttribute('placeholder') || '';
        if (/كود|خصم|coupon|discount/i.test(placeholder)) {
          input.closest('div')?.classList.add('dawish-coupon-field');
        }
      });
    };
    run();
    setTimeout(run, 800);
    setTimeout(run, 1800);
  }

  const boot = () => {
    initPageContextClasses();
    initHeader();
    initSearch();
    initMobileMenu();
    initFloatingActions();
    initCartAnimation();
    initProductImagePolish();
    initVariantOptionsPolish();
    initCartAndCheckoutPolish();
    document.dispatchEvent(new CustomEvent('dawish::ready'));
  };

  initLoader();

  if (window.salla?.onReady) {
    salla.onReady(boot);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
