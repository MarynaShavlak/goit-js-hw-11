import { refs } from './refs';
export function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}
export function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
  console.log('we show load more btn');
}
