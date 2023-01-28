export function setSmoothScroll(el) {
  const { height: cardHeight } = el.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
