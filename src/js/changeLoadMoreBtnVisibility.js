import { refs } from './refs';
export function hideLoadMoreBtn() {
  const isLoadMoreBtnVisible =
    !refs.loadMoreBtn.classList.contains('is-hidden');

  if (isLoadMoreBtnVisible) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }
}
export function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
