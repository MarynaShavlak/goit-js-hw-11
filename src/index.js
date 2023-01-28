import { refs } from './js/refs';
import { ImagesAPI } from './js/imagesApi';
import {
  insertGalleryMarkup,
  cleanPreviousSearchResults,
} from './js/galleryInterface';
import { createGalleryMarkup } from './js/imageCardMarkup';
import {
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/changeLoadMoreBtnVisibility';
import { changeSwitchToggleStyle } from './js/changeSwitchToggleStyle';
import { setSmoothScroll } from './js/smothScroll';

import SimpleLightbox from 'simplelightbox';
import notifications from './js/notifications';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;
const lightboxOptions = {
  captionDelay: 250,
  captionsData: 'alt',
};

let observer = new IntersectionObserver(onScroll, {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
});

const imagesApi = new ImagesAPI();
let hasMoreImagesToLoad;

async function onSearchFormSubmit(e) {
  e.preventDefault();
  cleanPreviousSearchResults();
  const searchedQuery = e.currentTarget.elements.searchQuery.value.trim();
  hideLoadMoreBtn();

  imagesApi.query = searchedQuery;
  imagesApi.resetPage();

  try {
    const response = await imagesApi.getImages();
    const {
      data: { hits, totalHits: maxQuantityOfImagesToShow },
    } = response;

    if (!searchedQuery || hits.length === 0) {
      imagesApi.setTotal(0);
      notifications.showFailureNotification();
      cleanPreviousSearchResults();
      return;
    }

    notifications.showSuccessNotification(maxQuantityOfImagesToShow);
    insertGalleryMarkup(createGalleryMarkup(hits));
    lightbox = new SimpleLightbox('.gallery a', lightboxOptions);

    imagesApi.setTotal(maxQuantityOfImagesToShow);

    onToggle();
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreBtn() {
  imagesApi.incrementPage();

  try {
    const response = await imagesApi.getImages();
    const {
      data: { hits: images },
    } = response;
    showImages(refs.galleryListEl, images);
    hasMoreImagesToLoad = imagesApi.hasMoreImages();

    if (!hasMoreImagesToLoad) {
      hideLoadMoreBtn();
      notifications.showInfoNotification();
    }
  } catch (error) {
    console.log(error);
  }
}

function onScroll(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      cancelInfiniteScroll();
      imagesApi.incrementPage();

      try {
        const response = await imagesApi.getImages();
        const {
          data: { hits: images },
        } = response;
        showImages(refs.galleryListEl, images);
        hasMoreImagesToLoad = imagesApi.hasMoreImages();

        if (hasMoreImagesToLoad) {
          setInfiniteScroll();
        } else {
          hideLoadMoreBtn();
          notifications.showInfoNotification();
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}

function onToggle() {
  const isInfininiteScrollActive = refs.toggleEl.checked;
  hasMoreImagesToLoad = imagesApi.hasMoreImages();

  if (refs.galleryListEl.innerHTML) {
    if (hasMoreImagesToLoad) {
      if (isInfininiteScrollActive) {
        hideLoadMoreBtn();
        setInfiniteScroll();
      } else {
        showLoadMoreBtn();
        cancelInfiniteScroll();
      }
    }
  }
}

function setInfiniteScroll() {
  const item = document.querySelector('.gallery__item:last-child');
  observer.observe(item);
}

function cancelInfiniteScroll() {
  const item = document.querySelector('.gallery__item:last-child');
  observer.unobserve(item);
}

function showImages(container, images) {
  insertGalleryMarkup(createGalleryMarkup(images));
  lightbox.refresh();
  setSmoothScroll(container);
}

refs.searchFormEl.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);
refs.toggleEl.addEventListener('input', onToggle);
refs.toggleEl.addEventListener('click', changeSwitchToggleStyle);
