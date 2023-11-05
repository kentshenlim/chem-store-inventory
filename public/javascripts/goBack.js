(() => {
  const backElms = document.querySelectorAll('.go-back');
  backElms.forEach((elm) => {
    elm.addEventListener('click', () => {
      history.back();
    });
  });
})();
