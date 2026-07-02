/* Fade-in on scroll for softeditools.com sage editorial theme.
   Adds .js-fade to <html> only when it will actually animate, so content
   is never hidden for no-JS visitors or reduced-motion users. */
(function () {
  'use strict';

  function init() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var selector = '.tool-card, .blog-card, .stat-card, main section';
    var targets = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add('fade-in'); });
    document.documentElement.classList.add('js-fade');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
