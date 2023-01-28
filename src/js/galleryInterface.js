import { refs } from './refs';

export function insertGalleryMarkup(galleryMarkup) {
  refs.galleryListEl.insertAdjacentHTML('beforeend', galleryMarkup);
}

export function cleanPreviousSearchResults() {
  if (refs.galleryListEl.innerHTML) {
    refs.galleryListEl.innerHTML = '';
  }
}
