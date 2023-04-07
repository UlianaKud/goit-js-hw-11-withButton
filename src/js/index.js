import { PixabayAPI } from './pixabay-api';
import { renderImagesList } from './renderImageList';

import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

const searchFormEl = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const spinnerContainer = document.querySelector('.spinner');

const showSpinner = () => {
  spinnerContainer.classList.remove('is-spinner-hidden');
};

const hideSpinner = () => {
  spinnerContainer.classList.add('is-spinner-hidden');
};

const pixabayApi = new PixabayAPI();
let gallery;

const onSearchFormSubmit = async event => {
  event.preventDefault();
  pixabayApi.page = 1;

  const searchQuery = event.currentTarget.elements['searchQuery'].value;
  pixabayApi.q = searchQuery;
  if (!searchQuery?.trim()) {
    galleryList.innerHTML = '';
    loadMoreBtnEl.classList.add('is-hidden');
    Notiflix.Notify.failure('Oops, request is empty');
    return;
  }

  try {
    showSpinner();
    galleryList.innerHTML = '';
    const { data } = await pixabayApi.fetchPhotos();
    if (!data.hits?.length) {
      hideSpinner();
      galleryList.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    pixabayApi.totalHits = data?.totalHits;
    hideSpinner();
    if (data?.hits?.length < 40) {
      loadMoreBtnEl.classList.add('is-hidden');
    } else {
      loadMoreBtnEl.classList.remove('is-hidden');
    }

    galleryList.innerHTML = renderImagesList(data.hits);
    gallery = new SimpleLightbox('.gallery a');

    Notiflix.Notify.success(`"Hooray! We found ${data.totalHits} images.`);
  } catch (err) {
    hideSpinner();
    console.log(err);
  }
};

const onLoadMoreBtnClick = async () => {
  pixabayApi.page += 1;

  try {
    loadMoreBtnEl.classList.add('is-hidden');
    showSpinner();
    const { data } = await pixabayApi.fetchPhotos();
    hideSpinner();
    console.log(pixabayApi.page * pixabayApi.per_page, pixabayApi.totalHits);
    if (pixabayApi.page * pixabayApi.per_page >= pixabayApi.totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
    } else {
      loadMoreBtnEl.classList.remove('is-hidden');
    }
    galleryList.insertAdjacentHTML('beforeend', renderImagesList(data.hits));
    gallery.refresh();
    const { height } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: height * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    hideSpinner();
    isLoading = false;
    console.log(err);
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
