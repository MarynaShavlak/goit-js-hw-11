import { refs } from './refs';

export function insertGalleryMarkup(galleryMarkup) {
  refs.galleryListEl.insertAdjacentHTML('beforeend', galleryMarkup);
}

export function cleanPreviousSearchResults() {
  refs.galleryListEl.innerHTML = '';
}
