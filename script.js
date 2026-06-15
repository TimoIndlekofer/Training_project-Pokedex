// ##### JavaScript file for all functions #####

const errorMessage = document.getElementById('no-results-error-message');
const loadMoreButton = document.getElementById('load-more-pokemons');
const searchBar = document.getElementById('search-bar-input');
const clearButton = document.getElementById('search-bar-clear-button');
const searchButton = document.getElementById('search-bar-button');
const headerSearchBar = document.getElementById('search-bar-container');
const letterMessage = document.getElementById('search-bar-letter-message');
const loadingSpinner = document.getElementById('loading-spinner');

const dialogBox = document.getElementById('dialog-pokemon-details');
const aboutButton = document.getElementById('dialog-about-button');
const baseStatsButton = document.getElementById('dialog-base-stats-button');
const evolutionButton = document.getElementById('dialog-evolution-button');
const aboutTab = document.getElementById('tab-about');
const baseStatsTab = document.getElementById('tab-base-stats');
const evolutionTab = document.getElementById('tab-evolution');

let pokemonCardsContainer = document.getElementById('pokemon-cards-container');

let allPokemons = [];
let offset = 20;


// Functions

function init() {
    console.log(allPokemons);
    startPositionAfterWebsiteLoading();
    fetchAllPokemons();
    initClearButton();
    searchButtonEnterKey();
}


function startPositionAfterWebsiteLoading() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
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
        pokemonCardsContainer.classList.remove('pokemon-cards-main-height-deactivated');
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
    loadMoreButton.style.display = 'block';
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
    loadMoreButtonActivated();
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
        pokemonCardsContainer.classList.add('pokemon-cards-main-height-deactivated');
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


function showPokemonDetailsInDialog() {
    aboutButton.classList.add('active');
    baseStatsButton.classList.remove('active');
    evolutionButton.classList.remove('active');
    // aboutTab.style.display = 'block';

    aboutTab.classList.remove('hidden');
    baseStatsTab.classList.add('hidden');
    evolutionTab.classList.add('hidden');
    
    dialogBox.showModal();
}


function showDialogTabAbout() {
    aboutButton.classList.add('active');
    baseStatsButton.classList.remove('active');
    evolutionButton.classList.remove('active');

    // aboutTab.style.display = 'block';
    // baseStatsTab.style.display = 'none';
    // evolutionTab.style.display = 'none';


    // Neu:
    aboutTab.classList.remove('hidden');
    baseStatsTab.classList.add('hidden');
    evolutionTab.classList.add('hidden');
}


function showDialogTabBaseStats() {
    aboutButton.classList.remove('active');
    baseStatsButton.classList.add('active');
    evolutionButton.classList.remove('active');

    // aboutTab.style.display = 'none';
    // baseStatsTab.style.display = 'block';
    // evolutionTab.style.display = 'none';


    // Neu:
    aboutTab.classList.add('hidden');
    baseStatsTab.classList.remove('hidden');
    evolutionTab.classList.add('hidden');    
}


function showDialogTabEvolution() {
    aboutButton.classList.remove('active');
    baseStatsButton.classList.remove('active');
    evolutionButton.classList.add('active');

    // aboutTab.style.display = 'none';
    // baseStatsTab.style.display = 'none';
    // evolutionTab.style.display = 'block';


    // Neu:
    aboutTab.classList.add('hidden');
    baseStatsTab.classList.add('hidden');
    evolutionTab.classList.remove('hidden');
}


function closeDialog() {
    // aboutTab.style.display = 'none';
    // baseStatsTab.style.display = 'none';
    // evolutionTab.style.display = 'none';


    // Neu:
    aboutTab.classList.add('hidden');
    baseStatsTab.classList.add('hidden');
    evolutionTab.classList.add('hidden');

    dialogBox.close();
}