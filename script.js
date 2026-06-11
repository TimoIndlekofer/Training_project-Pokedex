// ##### JavaScript file for all functions #####

const errorMessage = document.getElementById('no-results-error-message');
const loadMoreButton = document.getElementById('load-more-pokemons');

let pokemonCardsContainer = document.getElementById('pokemon-cards-container');

let allPokemons = [];
// let pokemonCardsData = [];
let offset = 20;




function init() {
    console.log(allPokemons);
    fetchAllPokemons();

    renderFilteredPokemons(allPokemons);
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
    // let pokemonCardsContainer = document.getElementById('pokemon-cards-container');
    pokemonCardsContainer.innerHTML = '';

    let pokemonCardsData = [];

    for (let i = 0; i < pokemonList.length; i++) {
        // const pokemonURL = allPokemons[i].url;

        if(!pokemonList[i]) { continue; }

        const pokemonURL = pokemonList[i].url;
        const pokemonDetails = await fetchPokemonDetails(pokemonURL);
        pokemonCardsData += pokemonDetails;
    }
    pokemonCardsContainer.innerHTML = pokemonCardsData; 
}


async function fetchMorePokemons() {
    try {
        let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=' + offset);
        let responseAsJSON = await response.json();
        console.log(response);
        offset += 20;
        
        allPokemons.push(...responseAsJSON.results);
        renderPokemons(allPokemons);
        console.log(allPokemons);
    } catch (error) {
        console.log('Fehler beim Laden der Daten:', error);        
    }
}


async function filterAndShowPokemon(filterWord) {
    if (!filterWord.trim()) {
        renderPokemons(allPokemons);
        return;
    }
    const currentPokemons = allPokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(filterWord.toLowerCase())
    );
    renderPokemons(currentPokemons);
}


async function renderFilteredPokemons(currentPokemons) {
    let pokemonCardsDataFiltered = '';

    pokemonCardsContainer.innerHTML = '';

    for (let i = 0; i < currentPokemons.length; i++) {
        const pokemonName = currentPokemons[i];
        const pokemonDetails = await fetchPokemonDetails(pokemonName.url);

        if (pokemonDetails) {
            pokemonCardsDataFiltered += getPokemonTemplate(pokemonDetails);
        }
    }
    pokemonCardsContainer.innerHTML = pokemonCardsDataFiltered;
}