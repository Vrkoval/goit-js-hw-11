import axios from "axios";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const OUR_URL = 'https://pixabay.com/api/';
const KEY_API='35660252-a6a2123775fa2a75b6944ac36';
export default class findApi {
        constructor(){
            this.query = '';
            this.page = 1;    
        }
        
        getData() {
            const URL = `${OUR_URL}?key=${KEY_API}&q=${this.query}&
            image_type=photo&orientation=horizontal&
            safesearch=true&per_page=40&page=${this.page}`;
              
           return fetch(URL)
            .then(r => r.json())
            .then(({ hits }) => {
                this.incrementPage();
        
                return hits;
        
            });
        };
            incrementPage() {
            this.page += 1;
        }
            resetPage() {
                this.page = 1;
            }
        
        
        get searchQuery() {
            return this.query;
        };
        
        set searchQuery(newQuery) {
            this.query = newQuery;
        };
        };
  
  
  