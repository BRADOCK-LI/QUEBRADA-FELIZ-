(() => {
  'use strict';
  document.documentElement.classList.add('has-js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  const closeMenu = (restoreFocus = false) => {
    navigation.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    if (restoreFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => {
    const open = !navigation.classList.contains('open');
    navigation.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu(true);
    if (event.key === 'Tab' && navigation.classList.contains('open')) {
      const links = [...navigation.querySelectorAll('a')];
      const first = links[0];
      const last = menuButton;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const desktop = window.matchMedia('(min-width: 721px)');
  desktop.addEventListener('change', event => { if (event.matches) closeMenu(); });

  const revealElements = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    try {
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
        });
      }, { threshold: 0, rootMargin: '0px 0px -30px 0px' });
      revealElements.forEach(element => revealObserver.observe(element));
      document.documentElement.classList.add('js-ready');
      reducedMotion.addEventListener('change', event => {
        if (event.matches) { document.documentElement.classList.remove('js-ready'); revealObserver.disconnect(); }
      });
    } catch { document.documentElement.classList.remove('js-ready'); }
  }

  const chapters = [...document.querySelectorAll('.chapter')];
  const chapterLabel = document.querySelector('[data-current-chapter]');
  const readerTools = document.querySelector('.reader-tools');
  let scrollFrame = 0;
  function updateReading() {
    const total = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const progress = total ? Math.max(0, Math.min(100, window.scrollY / total * 100)) : 0;
    document.documentElement.style.setProperty('--reading-progress', progress.toFixed(2) + '%');
    const firstChapter = chapters[0]?.getBoundingClientRect();
    const lastChapter = chapters[chapters.length - 1]?.getBoundingClientRect();
    const readingStory = firstChapter && lastChapter && firstChapter.top <= window.innerHeight * .7 && lastChapter.bottom >= window.innerHeight * .15;
    readerTools.classList.toggle('visible', Boolean(readingStory));
    const readingLine = window.innerHeight * .42;
    let current = null;
    chapters.forEach((chapter, index) => { if (chapter.getBoundingClientRect().top <= readingLine) current = index; });
    chapterLabel.textContent = current === null ? 'Boa leitura.' : 'Capítulo 0' + (current + 1) + ' de 03';
    scrollFrame = 0;
  }
  function requestReadingUpdate() { if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateReading); }
  window.addEventListener('scroll', requestReadingUpdate, { passive: true });
  window.addEventListener('resize', requestReadingUpdate, { passive: true });
  window.addEventListener('load', updateReading);
  updateReading();

  document.querySelector('.reading-toggle').addEventListener('click', event => {
    const active = document.body.classList.toggle('large-text');
    event.currentTarget.setAttribute('aria-pressed', String(active));
    event.currentTarget.setAttribute('title', active ? 'Restaurar tamanho do texto' : 'Aumentar o texto da história');
    event.currentTarget.querySelector('.sr-only').textContent = active ? 'Restaurar tamanho do texto' : 'Aumentar texto para leitura';
    requestReadingUpdate();
  });

  const wordCount = document.querySelector('.story').textContent.trim().split(/\s+/).length;
  document.querySelector('[data-reading-time]').textContent = Math.max(1, Math.ceil(wordCount / 200)) + ' MIN DE LEITURA';
  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  const shareButton = document.querySelector('[data-share]');
  const shareStatus = document.querySelector('[data-share-status]');
  const shareFallback = document.querySelector('[data-share-fallback]');
  function showShareFallback(url) {
    shareFallback.hidden = false;
    const field = shareFallback.querySelector('input');
    field.value = url;
    field.focus();
    field.select();
    shareStatus.textContent = 'O endereço está selecionado para você copiar.';
  }
  shareButton.addEventListener('click', async () => {
    const url = new URL(window.location.href);
    url.hash = '';
    shareStatus.textContent = '';
    shareFallback.hidden = true;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Quebrada Feliz', text: 'Toda rua tem uma história. Conheça a Quebrada Feliz.', url: url.href });
        shareStatus.textContent = 'Obrigado por levar essa história adiante.';
        return;
      } catch (error) { if (error.name === 'AbortError') return; }
    }
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(url.href); shareStatus.textContent = 'Link copiado! Agora é só compartilhar.'; return; } catch { /* Allow manual copy below. */ }
    }
    showShareFallback(url.href);
  });
})();
