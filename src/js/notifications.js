import { Notify } from 'notiflix/build/notiflix-notify-aio';

function showFailureNotification() {
  return Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
function showInfoNotification() {
  return Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

function showSuccessNotification(totalFoundImages) {
  return Notify.success(`Hooray! We found ${totalFoundImages} images.`);
}

export default {
  showFailureNotification,
  showInfoNotification,
  showSuccessNotification,
};
