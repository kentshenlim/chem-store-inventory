(() => {
  function refreshTheme() {
    if (localStorage.csiTheme === 'dark' || (!localStorage.csiTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else document.documentElement.classList.remove('dark');
  }

  const [lightBtn, darkBtn] = [
    document.getElementById('light-theme-toggler'),
    document.getElementById('dark-theme-toggler'),
  ];

  lightBtn.addEventListener('click', () => {
    localStorage.setItem('csiTheme', 'light');
    refreshTheme();
  });
  darkBtn.addEventListener('click', () => {
    localStorage.setItem('csiTheme', 'dark');
    refreshTheme();
  });

  refreshTheme();
})();
