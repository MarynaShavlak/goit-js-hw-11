import { refs } from './refs';

export function changeSwitchToggleStyle() {
  const isInfininiteScrollActive = refs.toggleEl.checked;
  if (isInfininiteScrollActive) {
    refs.scrollIconEl.classList.toggle('active');
    refs.btnIconEl.classList.toggle('active');
  } else {
    refs.scrollIconEl.classList.toggle('active');
    refs.btnIconEl.classList.toggle('active');
  }
}
