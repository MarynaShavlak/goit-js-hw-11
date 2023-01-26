import { ImagesAPI } from './js/imagesApi';
import notifications from './js/notifications';
import { createGalleryMarkup } from './js/imageCardMarkup';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const imagesApi = new ImagesAPI();
hideLoadMoreBtn();

// const modalImage = new SimpleLightbox('.gallery a', {
//   coverlay: true,
//   captions: true,
//   captionSelector: 'img',
//   captionType: 'attr',
//   captionsData: 'alt',
//   captionPosition: 'bottom',
//   captionDelay: 250,
//   download: 'click here to download',
// });

function onSearchFormSubmit(e) {
  e.preventDefault();
  if (galleryListEl.innerHTML) {
    cleanPreviousSearchResults();
  }
  const searchedQuery = e.currentTarget.elements.searchQuery.value.trim();

  const isLoadMoreBtnVisible = !loadMoreBtn.classList.contains('is-hidden');

  if (isLoadMoreBtnVisible) {
    hideLoadMoreBtn();
    console.log('we hide load more btn');
  }

  if (!searchedQuery) {
    if (galleryListEl.innerHTML) {
      cleanPreviousSearchResults();
    }
    notifications.showFailureNotification();
    e.currentTarget.reset();
    return;
  }

  imagesApi.query = searchedQuery;
  imagesApi.resetPage();
  e.currentTarget.reset();
  imagesApi.getImages().then(response => {
    const {
      data: { hits, totalHits: maxQuantityOfImagesToShow },
    } = response;
    console.log(hits);
    console.log(maxQuantityOfImagesToShow);

    if (hits.length === 0) {
      notifications.showFailureNotification();
      if (galleryListEl.innerHTML) {
        cleanPreviousSearchResults();
      }

      cleanPreviousSearchResults();
      return;
    }

    showLoadMoreBtn();
    notifications.showSuccessNotification(maxQuantityOfImagesToShow);
    insertGalleryMarkup(createGalleryMarkup(hits));
    imagesApi.setTotal(maxQuantityOfImagesToShow);

    const hasMorePhotosToLoad = imagesApi.hasMorePhotos();
    console.log(hasMorePhotosToLoad);
    // if (!hasMorePhotosToLoad) {
    //   hideLoadMoreBtn();
    // }
  });
}

function insertGalleryMarkup(galleryMarkup) {
  galleryListEl.insertAdjacentHTML('beforeend', galleryMarkup);
}

function cleanPreviousSearchResults() {
  galleryListEl.innerHTML = '';
}
function onLoadMoreBtn() {
  imagesApi.incrementPage();
  console.log('click');
  imagesApi
    .getImages()
    .then(response => {
      const {
        data: { hits, totalHits: maxQuantityOfImagesToShow },
      } = response;
      insertGalleryMarkup(createGalleryMarkup(hits));

      const hasMorePhotosToLoad = imagesApi.hasMorePhotos();
      console.log(hasMorePhotosToLoad);

      if (!hasMorePhotosToLoad) {
        hideLoadMoreBtn();
        notifications.showInfoNotification();
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('is-hidden');
}
function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('is-hidden');
  console.log('we show load more btn');
}

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);
