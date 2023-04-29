import './css/styles.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from "notiflix/build/notiflix-notify-aio";
import getFotoApi from "./js/pixabay-api";
import { renderFoto, galleryList } from "./js/markup-images";

const form = document.querySelector(".search-form");
const loadMoreBtn = document.querySelector(".load-more");

form.addEventListener("submit", submitForm);
loadMoreBtn.addEventListener("click", onLoadMore);

const toGetFotoApi = new getFotoApi();

let lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
    animationSpeed: 350,
});

let totalImages = 0;

async function submitForm(e) {
    e.preventDefault();

    clearImagesGallery();
    const searchQuery = toGetFotoApi.query = e.currentTarget.elements.searchQuery.value.trim()
    if (!searchQuery) {
        enterWithoutRequest();
        return;
    }

    toGetFotoApi.resetPage()
    try {
        const response = await toGetFotoApi.fetchFoto(searchQuery);
        const totalHits = response.totalHits;
        totalImages += toGetFotoApi.per_page;

        if (response.hits.length === 0) {
            errorMessage();
            form.reset();
            return;
        }

        renderFoto(response.hits);

        Notify.info(`Hooray! We found ${totalHits} images.`,
            {
                timeout: 4000,
                width: "400px",
                fontSize: "18px",
                position: "right-top",
            },);
        
        lightbox.refresh();

        loadMoreBtn.classList.remove("is-hidden");

        if (response.hits.length < toGetFotoApi.per_page) {
            loadMoreBtn.classList.add("is-hidden")
        }

        form.reset()
    } catch (error) {
        errorMessage
    }
}

async function onLoadMore(searchQuery) {
    try {
        const response = await toGetFotoApi.fetchFoto(searchQuery);
        totalImages += toGetFotoApi.per_page;

        if (totalImages >= response.totalHits) {
            renderFoto(response.hits)
            loadMoreBtn.classList.add("is-hidden");
            scrollIsPressedButton();
            lightbox.refresh();

            Notify.failure("We're sorry, but you've reached the end of search results!",
                {
                    timeout: 4000,
                    width: "400px",
                    fontSize: "18px",
                    position: "right-top",
                },);
            return;
        }

        renderFoto(response.hits);
        scrollIsPressedButton();
        lightbox.refresh();
    }   catch (error) {
            errorMessage;
    }
}

    function scrollIsPressedButton() {
        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();
        
        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
    }

function clearImagesGallery() {
    galleryList.innerHTML = "";
    loadMoreBtn.classList.add("is-hidden");
}

function enterWithoutRequest() {
    Notify.warning("Plase enter a value to search for!",
        {
            timeout: 4000,
            width: "400px",
            fontSize: "18px",
            position: "right-top",
        },);
}

function errorMessage() {
    Notify.failure("Sorry, there are no images matching your search query. Please try again!",
        {
            timeout: 4000,
            width: "400px",
            fontSize: "18px",
            position: "right-top",
        },);
}