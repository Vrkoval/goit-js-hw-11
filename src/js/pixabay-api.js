import axios from "axios";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const OUR_URL = 'https://pixabay.com/api/';
const KEY_API='35660252-a6a2123775fa2a75b6944ac36';
export default class getFotoApi {
        constructor(){
            this.searchQuery = '';
            this.page = 1; 
            this.per_page=40;   
        }
        
        async fetchFoto() {
            const findParams=new URLFindParams(
                {
                    key: this.#KEY_API,
                    q: this.searchQuery,
                    image_type: 'photo',
                    orientation: 'horizontal',
                    safesearch: true,
                    per_page: this.per_page,
                    page: this.page, 
                }
            )
            const URL = `${OUR_URL}?${findParams}`;
            try{
                const response= await axios.get(URL)
                this.incrementPage()
                return response.data
            } catch(error) {
                Notify.failure('A request error ocurred!',
                {
                    timeout:2000,
                    width:'400px',
                    fontSize:'16px',
                    position:'right-top',
                },);
            
            }
        }  
        //    return fetch(URL)
        //     .then(r => r.json())
        //     .then(({ hits }) => {
        //         this.incrementPage();
        
        //         return hits;
        
        //     });
        // };
            incrementPage() {
            this.page += 1;
        }
            resetPage() {
                this.page = 1;
            }
        
        
        get query() {
            return this.searchQuery;
        }
        
        set query(newQuery) {
            this.searchQuery = newQuery;
        }
        }
  
  
  