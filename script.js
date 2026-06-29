// ##### JavaScript file for all functions on main page #####

const errorMessage = document.getElementById('no-results-error-message');
const loadMoreButton = document.getElementById('load-more-pokemons');
const searchBar = document.getElementById('search-bar-input');
const clearButton = document.getElementById('search-bar-clear-button');
const searchButton = document.getElementById('search-bar-button');
const headerSearchBar = document.getElementById('search-bar-container');
const letterMessage = document.getElementById('search-bar-letter-message');
const loadingSpinner = document.getElementById('loading-spinner');

let firstWebsiteStart = true;
let pokemonCardsContainer = document.getElementById('pokemon-cards-container');
let allPokemons = [];
let allPokemonDetails = [];
let currentViewOfPokemons = [];
let numbersOfPokemon = [];
let offset = 20;





// Functions:

function init() {
    startPositionAfterWebsiteLoading();
    checkLocalStorage();
    initClearButton();
    searchButtonEnterKey();
    initDialogBackdropClick();
}


function startPositionAfterWebsiteLoading() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
}


function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


async function fetchAllPokemons() {
    pokemonCardsContainer.innerHTML = '';
    try {
        let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
        let responseAsJSON = await response.json();
        allPokemons.push(...responseAsJSON.results);
        // renderPokemons(allPokemons);
        await renderPokemons(responseAsJSON.results);
    } catch (error) {
        console.log('Fehler beim Laden der Daten:', error);        
    }
}


function getPokemonIDFromURL(pokemonURL) {
    const pokemonURLParts = pokemonURL.split('/');
    return parseInt(pokemonURLParts[pokemonURLParts.length - 2]);
}


async function fetchPokemonDetails(pokemonURL) {
    const pokemonID = getPokemonIDFromURL(pokemonURL);
    
    const checkPokemonID = allPokemonDetails.find(pokemon => pokemon.id === pokemonID);

    if (checkPokemonID) return getPokemonTemplate(checkPokemonID);

    try {
        const responseDetails = await fetch(pokemonURL);
        const pokemonDetails = await responseDetails.json();
        allPokemonDetails.push(pokemonDetails);
        // return pokemonDetails;
        return getPokemonTemplate(pokemonDetails);
    } catch (error) {
        console.log('Fehler beim Laden der Daten:', error);
    }
    
    // Alte Variante:
    // try {
    //     const responseDetails = await fetch(pokemonURL);
    //     const pokemonDetails = await responseDetails.json();

    //     const checkPokemonID = allPokemonDetails.some(pokemon => pokemon.id === pokemonDetails.id);
    //     if (!checkPokemonID) {
    //         allPokemonDetails.push(pokemonDetails);
    //     }
    //     return getPokemonTemplate(pokemonDetails);
    // } catch (error) {
    //     console.log('Fehler beim Laden der Daten:', error);
    // }
}


function checkFirstWebsiteStart() {
    const value = loadDataFromLocalStorage();

    if (firstWebsiteStart && value > 20) {
        lastPositionAfterWebsiteLoading();
    }

    if (firstWebsiteStart) {
        firstWebsiteStart = false;
    }
}


function removeLoadingSpinner() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}


async function renderPokemons(pokemonList) {
    let pokemonCardsData = [];
    currentViewOfPokemons = [];

    for (let i = 0; i < pokemonList.length; i++) {
        if(!pokemonList[i]) { continue; }

        const pokemonURL = pokemonList[i].url;
        const pokemonDetails = await fetchPokemonDetails(pokemonURL);
        pokemonCardsData += pokemonDetails;

        const pokemonID = getPokemonIDFromURL(pokemonURL);
        const pokemonFound = allPokemonDetails.find(pokemon => pokemon.id === pokemonID);
        if (pokemonFound) { currentViewOfPokemons.push(pokemonFound); }
    }
    pokemonCardsContainer.innerHTML = pokemonCardsData;
    
    checkFirstWebsiteStart();
    removeLoadingSpinner();
}


async function fetchMorePokemons() {
    try {
        loadingSpinner.style.display = 'flex';
        pokemonCardsContainer.classList.remove('pokemon-cards-main-height-deactivated');
        let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=' + offset);
        let responseAsJSON = await response.json();
        offset += 20;

        deactivateLoadMoreButton();
        allPokemons.push(...responseAsJSON.results);
        await renderPokemons(allPokemons);
        activateLoadMoreButton();
        saveDataToLocalStorage();
    } catch (error) {
        console.log('Fehler beim Laden der Daten:', error);        
    }
}


function deactivateLoadMoreButton() {
    loadMoreButton.disabled = true;
    loadMoreButton.classList.add('deactivate');
}


function activateLoadMoreButton() {
    loadMoreButton.disabled = false;
    loadMoreButton.classList.remove('deactivate');
    loadMoreButton.style.display = 'block';
}


function resetSearchBarIfEmpty(input) {
    if (input.value.trim() === '') {
        renderPokemons(allPokemons);
        startSearch();
        scrollToTop();
    }
}


function checkSearchBarInput(filterWord) {
    if (filterWord.length < 3) {
        letterMessage.style.visibility = 'visible';
        return;
    } else {
        letterMessage.style.visibility = 'hidden';
        filterAndShowPokemons(filterWord);
        return;
    }
}


function initClearButton() {
    searchBar.addEventListener('input', toggleSearchBarClearButton);
    clearButton.addEventListener('click', clearSearchBar);
}


function toggleSearchBarClearButton() {
    if (searchBar.value.length > 0) {
        clearButton.style.display = 'flex';
    } else {
        clearButton.style.display = 'none';
    }
}


function clearSearchBar() {
    searchBar.value = '';
    clearButton.style.display = 'none';
    letterMessage.style.visibility = 'hidden';
    errorMessage.style.display = 'none';
    searchBar.focus();
    renderPokemons(allPokemons);
    activateLoadMoreButton();
    scrollToTop();
}


function startSearch() {
    const filterWord = searchBar.value.trim();

    if (filterWord.length === 0) {
        renderPokemons(allPokemons);
        letterMessage.style.visibility = 'hidden';
        loadMoreButton.style.display = 'block';
        errorMessage.style.display = 'none';
        return;
    }
    checkSearchBarInput(filterWord); 
}


function searchButtonEnterKey() {
    if (!searchBar) return;

    searchBar.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            startSearch();
        }
    });
}


function showSearchResults(currentPokemons) {
    if (currentPokemons.length === 0) {
        loadMoreButton.style.display = 'none';
        errorMessage.style.display = 'block';
        pokemonCardsContainer.classList.add('pokemon-cards-main-height-deactivated');
        renderPokemons([]);
    } else {
        errorMessage.style.display = 'none';
        renderPokemons(currentPokemons);
    }
    scrollToTop();
}


async function filterAndShowPokemons(filterWord) {
    if (!filterWord.trim()) {
        renderPokemons(allPokemons);
        return;
    }

    const currentPokemons = allPokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(filterWord.toLowerCase())
    );
    currentViewOfPokemons = currentPokemons;
    loadMoreButton.style.display = 'none';
    showSearchResults(currentPokemons);
}


function saveDataToLocalStorage() {
    localStorage.setItem('NumberOfPokemon', allPokemonDetails.length);
}


function loadDataFromLocalStorage() {
    return localStorage.getItem('NumberOfPokemon');
}


function lastPositionAfterWebsiteLoading() {
    requestAnimationFrame(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });  
}


function openImpressum() {
    alert("Note: This is only a practice project for educational purposes. The site will not be made publicly available, which is why no legal imprint is provided.");
}


function openPrivacyPolicy() {
    alert("Note: This is only a practice project for educational purposes. The site will not be made publicly available and does not collect, store, or process any personal data from users.");
}


async function fetchAllPokemonsFromLocalStorage(value) {
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${value}&offset=0`);
        let responseAsJSON = await response.json();
        allPokemons.push(...responseAsJSON.results);
        offset = allPokemons.length;        
        renderPokemons(allPokemons);
    } catch (error) {
        console.log('Fehler beim Laden der Daten:', error);        
    }
}


function checkLocalStorage() {
    const value = loadDataFromLocalStorage();

    if (!value || value == 0) {
        return fetchAllPokemons();
    } 
    fetchAllPokemonsFromLocalStorage(value);
}
