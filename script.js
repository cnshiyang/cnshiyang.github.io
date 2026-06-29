(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const themeIconUse = document.getElementById('theme-icon-use');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const topbar = document.querySelector('.topbar');

  function applyTheme(theme, remember) {
    const isDark = theme === 'dark';
    root.dataset.theme = theme;
    themeIconUse.setAttribute('href', isDark ? '#icon-sun' : '#icon-moon');
    toggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    toggle.setAttribute('aria-pressed', String(isDark));
    themeMeta.setAttribute('content', isDark ? '#171716' : '#fbfbf8');
    if (remember) localStorage.setItem('yang-shi-theme', theme);
  }

  applyTheme(root.dataset.theme || 'light', false);

  toggle.addEventListener('click', function () {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  systemTheme.addEventListener('change', function (event) {
    if (!localStorage.getItem('yang-shi-theme')) {
      applyTheme(event.matches ? 'dark' : 'light', false);
    }
  });

  function updateTopbar() {
    topbar.classList.toggle('scrolled', window.scrollY > 12);
  }

  window.addEventListener('scroll', updateTopbar, { passive: true });
  updateTopbar();
})();
