(function () {
  var css = [
    '.site-nav{background:transparent;padding:14px 20px 0;}',
    '.site-nav__inner{max-width:1020px;margin:0 auto;padding:0 26px;height:56px;',
      'display:flex;align-items:center;justify-content:space-between;',
      'background:rgba(253,252,247,.92);border:1px solid #E5E1D3;border-radius:999px;',
      '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);}',
    '.site-nav__brand{font-family:"Cormorant Garamond",Georgia,Cambria,serif;',
      'font-size:1.3rem;font-weight:600;color:#33382E;text-decoration:none;',
      'letter-spacing:0.01em;transition:color 0.15s;flex-shrink:0;}',
    '.site-nav__brand:hover{color:#5B6B4E;}',
    '.site-nav__links{display:flex;align-items:center;gap:28px;',
      'list-style:none;margin:0;padding:0;}',
    '.site-nav__links a{font-family:Inter,"Segoe UI",Arial,sans-serif;',
      'font-size:0.875rem;color:#7A7E6F;text-decoration:none;',
      'letter-spacing:0.01em;transition:color 0.15s;}',
    '.site-nav__links a:hover{color:#5B6B4E;}',
    '.site-nav__toggle{display:none;flex-direction:column;justify-content:center;',
      'gap:5px;background:none;border:none;cursor:pointer;padding:6px 4px;}',
    '.site-nav__toggle span{display:block;width:22px;height:1.5px;',
      'background:#33382E;border-radius:2px;}',
    '@media(max-width:600px){',
      '.site-nav{position:relative;padding:10px 14px 0;}',
      '.site-nav__inner{height:50px;padding:0 20px;}',
      '.site-nav__toggle{display:flex;}',
      '.site-nav__links{display:none;position:absolute;top:100%;left:14px;right:14px;',
        'margin-top:8px;background:#FDFCF7;border:1px solid #E5E1D3;border-radius:16px;',
        'box-shadow:0 12px 32px rgba(63,74,56,.12);z-index:50;',
        'flex-direction:column;align-items:stretch;gap:0;padding:6px 0 10px;}',
      '.site-nav__links.is-open{display:flex;}',
      '.site-nav__links a{display:block;padding:10px 20px;font-size:0.9rem;}',
    '}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main navigation');
  nav.innerHTML =
    '<div class="site-nav__inner">' +
      '<a href="/" class="site-nav__brand">SoftEdit Tools</a>' +
      '<button class="site-nav__toggle" aria-label="Toggle navigation" aria-expanded="false">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
      '<ul class="site-nav__links" role="list">' +
        '<li><a href="/">Tools</a></li>' +
        '<li><a href="/blog/">Blog</a></li>' +
        '<li><a href="/about/">About</a></li>' +
        '<li><a href="/contact/">Contact</a></li>' +
      '</ul>' +
    '</div>';

  document.body.insertBefore(nav, document.body.firstChild);

  var toggle = nav.querySelector('.site-nav__toggle');
  var menu = nav.querySelector('.site-nav__links');
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}());
