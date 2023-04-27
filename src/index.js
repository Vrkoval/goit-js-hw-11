import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
const markup = {
  
  createOneCard(srcObject) {
    return `
      <a class="slide-wrapper" href="${srcObject.largeImageURL}">
        <div class="photo-card">
          <div class="image">
            <img src="${srcObject.webformatURL}" alt="Tags: ${srcObject.tags}" loading="lazy"/>
          </div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>${srcObject.likes}
            </p>
            <p class="info-item">
              <b>Views</b>${srcObject.views}
            </p>
            <p class="info-item">
              <b>Comments</b>${srcObject.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>${srcObject.downloads}
            </p>
          </div>
        </div>
      </a>
    `;
  },

  createManyCards(srcArray) {
    const srcMarkup = srcArray.map(this.createOneCard);
    return srcMarkup.join('');
  },
};
const elementsFoto = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input[name="searchQuery"]'),
    divider:document.querySelector('.divider'),
    button: document.querySelector('.search-form button'),
    gallery: document.querySelector('.gallery'),
    spinner: document.querySelector('.spinner'),
}
const slider = new SimpleLightbox('.slide-wrapper', {
  overlayOpacity: 0.9,
  showCounter: false,
  captionsData: 'alt',
  captionDelay: 150,
});
let query='';
const api=new findApi();
class findApi {
  #OUR_URL='https://pixabay.com/api/';
  #KEY_API='35660252-a6a2123775fa2a75b6944ac36';
  constructor(){
      this.lastSearch='';
      this.perPage=40;
      this.isNewSearch=false;
      this.currentPage=1;
      this.isEndOfPages=false;
}


async getData(query){
  if (query!==this.lastSearch){
    this.isNewSearch=true;
    this.currentPage = 1;
  }
  else{
    this.isNewSearch = false;
  }

const response = await axios.get(
        this.#OUR_URL, {
            params: {
              key: this.#KEY_API,
              q: query,
              image_type: 'photo',
              orientation: 'horizontal',
              safesearch: true,
              per_page: this.perPage,
              page: this.currentPage,
            },
          });
  
      // console.log(axiosGet.data.hits);
       
  // axionsResponse();
  this.lastSearch=query;
this.isEndOfPages=this.perPage*this.currentPage>= response.data.totalHits;
this.currentPage+=1;
  
  return response;
                     
  Notify.init({ showOnlyTheLastOne: true, clickToClose: true });
  elementsFoto.form.addEventListener('submit', onSubmit);
  
  async function onSubmit(event) {
    event.preventDefault();
    query = elementsFoto.form.searchQuery.value.trim();
    if (query === '' || query === api.lastSearch) return;
  
    elementsFoto.button.disabled = true;
    clearPage();
    await renderPage();
    elementsFoto.button.disabled = false;
  }
  
  function clearPage() {
    elementsFoto.gallery.innerHTML = '';
  }
  
  async function renderPage() {
    try {
      elementsFoto.spinner.classList.remove('hidden');
      const srcData = await api.getData(query);
      const srcElements = srcData.data.hits;
  
      if (srcElements.length === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      }
  
      if (api.isNewSearch) {
        Notify.info(`Hooray! We found ${srcData.data.totalHits} images.`);
      }
  
      const htmlMarkup = await markup.createManyCards(srcElements);
      elementsFoto.gallery.insertAdjacentHTML('beforeend', htmlMarkup);
      slider.refresh();
    }
    catch (error) {
      Notify.failure(error.message);
    }
    finally {
      elementsFoto.spinner.classList.add('hidden');
    }
  }
  
  function onEndOfScroll(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && query !== '' && query === api.lastSearch) {
        if (!api.isEndOfPages) renderPage();
        else Notify.warning("We're sorry, but you've reached the end of search results.");
      }
    })
  }