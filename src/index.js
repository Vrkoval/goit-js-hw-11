import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const elementsFoto = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input[name="searchQuery"]'),
    submitBtn: document.querySelector('button'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}

constructor(){
  this.lastSearch='';
  this.perPage=40;
  this.isNewSearch=false;
  this.currentPage=1;
  this.isEndOfPages=false;
}
const axionsResponse = async () => {
    try {
      const axiosGet = await axios.get(
        ' https://pixabay.com/api/', {
            params: {
              key: '35660252-a6a2123775fa2a75b6944ac36',
              q: query,
              image_type: 'photo',
              orientation: 'horizontal',
              safesearch: true,
              per_page: this.perPage,
              page: this.currentPage,
            },
          });
  
      console.log(axiosGet.data.hits);
    } catch (error) {
      console.log(error);
    }
  };
  axionsResponse();
this.lastSearch=query;
this.isEndOfPages=this.perPage*this.currentPage>= axionsResponse.data.totalHits;
this.currentPage+=1;
  
  return axionsResponse;

}
