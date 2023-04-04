import { PixabayAPI } from './pixabay-api';
import { renderImagesList } from './renderImageList';

import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

const searchFormEl = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayApi = new PixabayAPI();
let gallery;
let isLoading = false;

// document.addEventListener('scroll', e => {
//   const { height } = galleryList.getBoundingClientRect();
//   const { height: slideHeight } = document
//       .querySelector('.gallery')
//       .firstElementChild.getBoundingClientRect();

//   if (height - window.pageYOffset < 1000 && !isLoading) {
//     onLoadMoreBtnClick();
//   }
// });

const onSearchFormSubmit = async event => {
  event.preventDefault();
  pixabayApi.page = 1;

  const searchQuery = event.currentTarget.elements['searchQuery'].value;
  pixabayApi.q = searchQuery;

  try {
    const { data } = await pixabayApi.fetchPhotos();
    if (!data.hits?.length) {
      galleryList.innerHTML = '';
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    galleryList.innerHTML = renderImagesList(data.hits);
    gallery = new SimpleLightbox('.gallery a');

    Notiflix.Notify.success(`"Hooray! We found ${data.totalHits} images.`);
    loadMoreBtnEl.classList.remove('is-hidden');
  } catch (err) {
    console.log(err);
  }
};

const onLoadMoreBtnClick = async () => {
  pixabayApi.page += 1;

  try {
    const { data } = await pixabayApi.fetchPhotos();
    if (pixabayApi.page * pixabayApi.per_page >= data.totalHits) {
      loadMoreBtnEl.classList.add('is-hidden');
      return;
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
    isLoading = false;
    console.log(err);
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

