export function renderImagesList(images) {
  const markup = images
    .map(img => {
      return `<div class="photo-card gallery__item">
        <a class="img-wrapper" href="${img.largeImageURL}"><img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes:</b>
            <br>
            <b>${img.likes}</b>
          </p>
          <p class="info-item">
            <b>Views:</b>
            <br>
            <b>${img.views}</b>
          </p>
          <p class="info-item">
            <b>Comments:</b>
            <br>
            <b>${img.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads:</b>
            <br>
            <b>${img.downloads}</b>
          </p>
        </div>
        </div>`;
    })
    .join('');

  return markup;
}
