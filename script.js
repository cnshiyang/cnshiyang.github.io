(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const themeIconUse = document.getElementById('theme-icon-use');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const topbar = document.querySelector('.topbar');
  const newsScroll = document.querySelector('.news-scroll');
  const newsItems = Array.from(document.querySelectorAll('#news-list > li'));
  const sectionLinks = Array.from(document.querySelectorAll('.topbar nav a[href^="#"]'))
    .map(function (link) {
      return { link, section: document.getElementById(link.getAttribute('href').slice(1)) };
    })
    .filter(function (item) {
      return item.section && item.section.classList.contains('content-section');
    });

  function savedTheme() {
    try {
      return localStorage.getItem('yang-shi-theme');
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme, remember) {
    const isDark = theme === 'dark';
    root.dataset.theme = theme;
    themeIconUse.setAttribute('href', isDark ? '#icon-sun' : '#icon-moon');
    toggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    toggle.setAttribute('aria-pressed', String(isDark));
    themeMeta.setAttribute('content', isDark ? '#181817' : '#ffffff');
    if (remember) {
      try {
        localStorage.setItem('yang-shi-theme', theme);
      } catch (error) {
        // The visible theme still switches when browser storage is unavailable.
      }
    }
  }

  applyTheme(root.dataset.theme || 'light', false);

  toggle.addEventListener('click', function () {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  systemTheme.addEventListener('change', function (event) {
    if (!savedTheme()) {
      applyTheme(event.matches ? 'dark' : 'light', false);
    }
  });

  function updateNewsWindowHeight() {
    if (!newsScroll || newsItems.length <= 5) return;
    const firstItemRect = newsItems[0].getBoundingClientRect();
    const lastVisibleItemRect = newsItems[4].getBoundingClientRect();
    const visibleHeight = lastVisibleItemRect.bottom - firstItemRect.top;
    const viewportLimit = Math.max(180, window.innerHeight * 0.52);
    newsScroll.style.maxHeight = `${Math.min(visibleHeight, viewportLimit)}px`;
  }

  updateNewsWindowHeight();
  window.addEventListener('load', updateNewsWindowHeight, { once: true });
  window.addEventListener('resize', updateNewsWindowHeight, { passive: true });

  function updateTopbar() {
    topbar.classList.toggle('scrolled', window.scrollY > 12);
    const offset = topbar.offsetHeight + 32;
    let current = null;
    sectionLinks.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= offset) current = item;
    });
    if (sectionLinks.length && window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= root.scrollHeight - 2) {
      current = sectionLinks[sectionLinks.length - 1];
    }
    sectionLinks.forEach(function (item) {
      if (item === current) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
  }

  let topbarFrame = null;
  function scheduleTopbarUpdate() {
    if (topbarFrame !== null) return;
    topbarFrame = window.requestAnimationFrame(function () {
      topbarFrame = null;
      updateTopbar();
    });
  }

  window.addEventListener('scroll', scheduleTopbarUpdate, { passive: true });
  window.addEventListener('resize', scheduleTopbarUpdate, { passive: true });
  window.addEventListener('load', scheduleTopbarUpdate, { once: true });
  updateTopbar();
})();
