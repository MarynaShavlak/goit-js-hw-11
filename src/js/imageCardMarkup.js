export function createGalleryMarkup(images) {
  return images.map(createImageCardMarkup).join('');
}

function createImageCardMarkup(imageInfo) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = imageInfo;
  return `

<li class="gallery__item">
<a class="photo-link"  href="${largeImageURL}">
    <div class="photo-card">
      <img
        src="${webformatURL}"
        class="gallery__image"
        alt="${tags}"
        loading="lazy"
      />
      <div class="info-wrapper">
       <div class="info">
        <p class="info-item"><i class="material-icons icon" >thumb_up</i>${likes}</p>
        <p class="info-item"><i class="material-icons icon" >visibility</i>${views}</p>
        <p class="info-item"><i class="material-icons icon" >message</i>${comments}</p>
        <p class="info-item"><i class="material-icons icon" >file_download</i>${downloads}</p>
      </div>
      </div>
     
    </div>
  </a>
  </li>
`;
}
