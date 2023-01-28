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

import SimpleLightbox from 'simplelightbox';
import notifications from './js/notifications';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

const lightboxOptions = {
  captionDelay: 250,
  captionsData: 'alt',
};

hideLoadMoreBtn();

const imagesApi = new ImagesAPI();

async function onSearchFormSubmit(e) {
  e.preventDefault();

  if (refs.galleryListEl.innerHTML) {
    cleanPreviousSearchResults();
  }
  const searchedQuery = e.currentTarget.elements.searchQuery.value.trim();

  const isLoadMoreBtnVisible =
    !refs.loadMoreBtn.classList.contains('is-hidden');

  if (isLoadMoreBtnVisible) {
    hideLoadMoreBtn();
    console.log('we hide load more btn');
  }

  if (!searchedQuery) {
    if (refs.galleryListEl.innerHTML) {
      cleanPreviousSearchResults();
    }
    notifications.showFailureNotification();
    e.currentTarget.reset();
    return;
  }

  imagesApi.query = searchedQuery;
  imagesApi.resetPage();
  // e.currentTarget.reset();

  try {
    const response = await imagesApi.getImages();
    const {
      data: { hits, totalHits: maxQuantityOfImagesToShow },
    } = response;
    console.log(hits);
    console.log(maxQuantityOfImagesToShow);

    if (hits.length === 0) {
      notifications.showFailureNotification();
      if (refs.galleryListEl.innerHTML) {
        cleanPreviousSearchResults();
      }

      cleanPreviousSearchResults();
      return;
    }

    notifications.showSuccessNotification(maxQuantityOfImagesToShow);
    insertGalleryMarkup(createGalleryMarkup(hits));
    lightbox = new SimpleLightbox('.gallery a', lightboxOptions);

    imagesApi.setTotal(maxQuantityOfImagesToShow);

    const hasMoreImagesToLoad = imagesApi.hasMoreImages();
    console.log(hasMoreImagesToLoad);

    // if (hasMoreImagesToLoad) {
    //   showLoadMoreBtn();
    // }

    if (hasMoreImagesToLoad) {
      const item = document.querySelector('.gallery__item:last-child');
      observer.observe(item);
    }
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMoreBtn() {
  imagesApi.incrementPage();

  console.log('click');
  try {
    const response = await imagesApi.getImages();
    const {
      data: { hits, totalHits: maxQuantityOfImagesToShow },
    } = response;
    insertGalleryMarkup(createGalleryMarkup(hits));
    lightbox.refresh();
    setSmoothScroll(refs.galleryListEl);
    const hasMoreImagesToLoad = imagesApi.hasMoreImages();
    console.log(hasMoreImagesToLoad);

    if (!hasMoreImagesToLoad) {
      hideLoadMoreBtn();
      notifications.showInfoNotification();
    }
  } catch (err) {
    console.log(err);
  }
}

function setSmoothScroll(el) {
  const { height: cardHeight } = el.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

let observer = new IntersectionObserver(setInfiniteScroll, {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
});
refs.searchFormEl.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function setInfiniteScroll(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      console.log('scroll');
      observer.unobserve(entry.target);
      imagesApi.incrementPage();
      try {
        const response = await imagesApi.getImages();
        const {
          data: { hits, totalHits: maxQuantityOfImagesToShow },
        } = response;
        insertGalleryMarkup(createGalleryMarkup(hits));
        lightbox.refresh();
        setSmoothScroll(refs.galleryListEl);
        const hasMoreImagesToLoad = imagesApi.hasMoreImages();
        console.log(hasMoreImagesToLoad);
        if (hasMoreImagesToLoad) {
          const item = document.querySelector('.gallery__item:last-child');
          observer.observe(item);
        } else {
          console.log('i see it');
          hideLoadMoreBtn();
          notifications.showInfoNotification();
        }
      } catch (error) {
        console.log(err);
      }
    }
  });
}
