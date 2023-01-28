import axios from 'axios';

export class ImagesAPI {
  #baseURL = 'https://pixabay.com/api/';
  #apiKey = '33117215-47f2ddcc93bc6218688d9ed56';
  #page = 1;
  #query = '';
  #totalResults = 0;
  #per_page = 40;

  getImages() {
    const searchParams = {
      params: {
        key: this.#apiKey,
        q: this.#query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: this.#per_page,
        page: this.#page,
      },
    };
    return axios.get(`${this.#baseURL}`, searchParams);
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  setTotal(total) {
    this.#totalResults = total;
  }

  hasMoreImages() {
    return this.#page < Math.ceil(this.#totalResults / this.#per_page);
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }
}
