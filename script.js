// ##### JavaScript file for all functions #####

const errorMessage = document.getElementById('no-results-error-message');
const loadMoreButton = document.getElementById('load-more-pokemons');
const searchBar = document.getElementById('search-bar-input');
const searchButton = document.getElementById('search-bar-button');
const headerSearchBar = document.getElementById('search-bar-container');
const letterMessage = document.getElementById('search-bar-letter-message');
const loadingSpinner = document.getElementById('loading-spinner');

let pokemonCardsContainer = document.getElementById('pokemon-cards-container');

let allPokemons = [];
let offset = 20;


// Functions

function init() {
    console.log(allPokemons);
    fetchAllPokemons();
    searchButtonEnterKey();
}


async function fetchAllPokemons() {
    try {
        let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
        let responseAsJSON = await response.json();
        // allPokemons = responseAsJSON.results;
        allPokemons.push(...responseAsJSON.results);
        renderPokemons(allPokemons);
    } catch (error) {
        console.log('Fehler beim Laden der Daten:', error);        
    }
}


async function fetchPokemonDetails(pokemonURL) {
    try {
        const responseDetails = await fetch(pokemonURL);
        const pokemonDetails = await responseDetails.json();
        console.log(pokemonDetails);
        // pokemonCardsData += getPokemonTemplate(pokemonDetails);
        return getPokemonTemplate(pokemonDetails);
        // return pokemonDetails;
    } catch (error) {
        console.log('Fehler beim Laden der Daten:', error);
    }
}


async function renderPokemons(pokemonList) {
    pokemonCardsContainer.innerHTML = '';

    let pokemonCardsData = [];

    for (let i = 0; i < pokemonList.length; i++) {
        if(!pokemonList[i]) { continue; }

        const pokemonURL = pokemonList[i].url;
        const pokemonDetails = await fetchPokemonDetails(pokemonURL);
        pokemonCardsData += pokemonDetails;
    }
    pokemonCardsContainer.innerHTML = pokemonCardsData; 

    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}


async function fetchMorePokemons() {
    try {
        loadingSpinner.style.display = 'flex';
        let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=' + offset);
        let responseAsJSON = await response.json();
        offset += 20;

        loadMoreButtonDeactivated();
        allPokemons.push(...responseAsJSON.results);
        await renderPokemons(allPokemons);
        loadMoreButtonActivated();
    } catch (error) {
        console.log('Fehler beim Laden der Daten:', error);        
    }
}


function loadMoreButtonDeactivated() {
    loadMoreButton.disabled = true;
    loadMoreButton.classList.add('deactivate');
}


function loadMoreButtonActivated() {
    loadMoreButton.disabled = false;
    loadMoreButton.classList.remove('deactivate');
}


function checkSearchBarInput(filterWord) {
    if (filterWord.length < 3) {
        // headerSearchBar.style.marginBottom = "auto";
        // letterMessage.style.display = 'flex';
        letterMessage.style.visibility = 'visible';
        return;
    } else {
        // headerSearchBar.style.marginBottom = "40px";
        // letterMessage.style.display = 'none';
        letterMessage.style.visibility = 'hidden';
        filterAndShowPokemons(filterWord);
        return;
    }
}


function startSearch() {
    const filterWord = searchBar.value.trim();

    if (filterWord.length === 0) {
        renderPokemons(allPokemons);
        // headerSearchBar.style.marginBottom = "40px";
        // letterMessage.style.display = 'none';
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


function checkCurrentPokemons(currentPokemons) {
    if (currentPokemons.length === 0) {
        loadMoreButton.style.display = 'none';
        errorMessage.style.display = 'block';
        renderPokemons([]);
        return;
    } else {
        errorMessage.style.display = 'none';
        return;
    }
}


async function filterAndShowPokemons(filterWord) {
    if (!filterWord.trim()) {
        renderPokemons(allPokemons);
        return;
    }

    const currentPokemons = allPokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(filterWord.toLowerCase())
    );
    loadMoreButton.style.display = 'none';
    checkCurrentPokemons(currentPokemons);
    renderPokemons(currentPokemons);
}