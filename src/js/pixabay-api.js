import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34961637-cb13560f0ea02cec767728576';

  q = null;
  page = 1;
  per_page = 40;
  orientation ="horizontal";

  fetchPhotos() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.q,
        image_type: 'photo',
        orientation: this.orientation,
        safesearch: true,
        page: this.page,
        per_page: this.per_page,
      },
    });
  }
}

