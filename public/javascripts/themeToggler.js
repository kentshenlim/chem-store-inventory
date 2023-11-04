(() => {
  const [lightBtn, darkBtn] = [
    document.getElementById('light-theme-toggler'),
    document.getElementById('dark-theme-toggler'),
  ];
  lightBtn.addEventListener('click', () => document.documentElement.classList.remove('dark'));
  darkBtn.addEventListener('click', () => document.documentElement.classList.add('dark'));
})();
