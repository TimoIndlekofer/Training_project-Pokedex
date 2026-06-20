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
let allPokemonDetails = [];
let allPokemonSpeciesDetails = [];
let pokemonEvolutionChain = [];
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
        allPokemonDetails.push(pokemonDetails);
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




console.log(allPokemons);
console.log(allPokemonDetails);



// Test für Dialog - Alles OK:

async function renderPokemonInDialog(id) {
    showPokemonDetailsInDialog();
    renderDialogHeader(id);
    await renderDialogMainTabAbout(id);
    renderDialogMainTabBaseStats(id);
    renderDialogMainTabEvolution(id);
}


function addDataInDialogHeader(singlePokemonID) {
    if (singlePokemonID) {
        document.getElementById('header-id').textContent = "#" + singlePokemonID.id;
        document.getElementById('header-name').textContent = singlePokemonID.name;
        document.getElementById('header-img').src = singlePokemonID.sprites.other.home.front_default;
        document.getElementById('header-badge1').textContent = singlePokemonID.types[0].type.name;
    }
}


function checkBadgesInDialogHeader(singlePokemonID) {
    if (singlePokemonID.types.length === 1) {
        document.getElementById('header-badge2').textContent = '';
        document.getElementById('header-badge2').classList.add('dialog-header-badges-hidden');
    } else if (singlePokemonID.types.length > 1) {
        document.getElementById('header-badge2').classList.remove('dialog-header-badges-hidden');;
        document.getElementById('header-badge2').textContent = singlePokemonID.types[1].type.name;
    }
}


function addBackgroundInDialogHeader(singlePokemonID) {
    const allTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
    const typeName = singlePokemonID.types[0].type.name;

    allTypes.forEach(type => {
        // document.getElementById('wrapper').classList.remove('bg-' + type);
        document.getElementById('header-container').classList.remove('bg-' + type);
        document.getElementById('header-close-button').classList.remove('bg-' + type);
    });
    // document.getElementById('wrapper').classList.add('bg-' + typeName);
    document.getElementById('header-container').classList.add('bg-' + typeName);
    document.getElementById('header-close-button').classList.add('bg-' + typeName);
}


function renderDialogHeader(id) {
    const singlePokemonID = allPokemonDetails.find(pokemon => pokemon.id === id);

    addDataInDialogHeader(singlePokemonID);
    checkBadgesInDialogHeader(singlePokemonID);
    addBackgroundInDialogHeader(singlePokemonID);
}


async function fetchPokemonSpeciesDetails(singlePokemonID) {
    try {
        const responseDetails = await fetch(singlePokemonID.species.url);
        const pokemonSpeciesDetails = await responseDetails.json();

        allPokemonSpeciesDetails.push(pokemonSpeciesDetails);
        return pokemonSpeciesDetails;
    } catch (error) {
        console.log('Fehler beim Laden der Daten:', error);
    }
}


function getPokemonAbilities(singlePokemonID) {
    let pokemonAbilities = [];

    for (let index = 0; index < singlePokemonID.length; index++) {
        let abilityName = singlePokemonID[index].ability.name;
        pokemonAbilities.push(abilityName.charAt(0).toUpperCase() + abilityName.slice(1));        
    }
    return pokemonAbilities.join(', ');
}


function getPokemonEggGroups(trainingData) {
    let pokemonEggGroups = [];

    for (let index = 0; index < trainingData.egg_groups.length; index++) {
        let eggGroupNames = trainingData.egg_groups[index].name;
        pokemonEggGroups.push(eggGroupNames.charAt(0).toUpperCase() + eggGroupNames.slice(1));
    }
    return pokemonEggGroups.join(', ');
}


async function addPokemonBasicData(singlePokemonID) {
    const speciesElement = aboutTab.querySelector('[data-pokemon="species"]');
    speciesElement.textContent = '';
    
    const speciesData = await fetchPokemonSpeciesDetails(singlePokemonID);
    const speciesDataEntry = speciesData.genera.find(data => data.language.name === 'en');

    aboutTab.querySelector('[data-pokemon="species"]').textContent = speciesDataEntry.genus;
    aboutTab.querySelector('[data-pokemon="height"]').textContent = (singlePokemonID.height / 10).toFixed(1).replace('.', ',') + " m";
    aboutTab.querySelector('[data-pokemon="weight"]').textContent = (singlePokemonID.weight / 10).toFixed(1).replace('.', ',') + " kg";
    
    const ability = getPokemonAbilities(singlePokemonID.abilities);
    aboutTab.querySelector('[data-pokemon="abilities"]').textContent = ability;
}


function addPokemonTrainingData(trainingData, singlePokemonID) {
    aboutTab.querySelector('[data-pokemon="catch-rate"]').textContent = trainingData.capture_rate;
    aboutTab.querySelector('[data-pokemon="base-exp"]').textContent = singlePokemonID.base_experience + " EP";
    aboutTab.querySelector('[data-pokemon="growth"]').textContent = trainingData.growth_rate.name.charAt(0).toUpperCase() + trainingData.growth_rate.name.slice(1);
}


function addPokemonEnvironmentData(trainingData) {
    const eggGroup = getPokemonEggGroups(trainingData);
    aboutTab.querySelector('[data-pokemon="egg-groups"]').textContent = eggGroup;

    if (trainingData.habitat) {
        const habitatName = trainingData.habitat.name;
        aboutTab.querySelector('[data-pokemon="habitat"]').textContent = habitatName.charAt(0).toUpperCase() + habitatName.slice(1);
    } else {
        aboutTab.querySelector('[data-pokemon="habitat"]').textContent = "Unknown";
    }
}


async function renderDialogMainTabAbout(id) {
    const singlePokemonID = allPokemonDetails.find(pokemon => pokemon.id === id);

    await addPokemonBasicData(singlePokemonID);

    const trainingData = allPokemonSpeciesDetails.find(pokemon => pokemon.id === id);
    
    addPokemonTrainingData(trainingData, singlePokemonID);
    addPokemonEnvironmentData(trainingData);
}


function addPokemonBaseStatData(singlePokemonID) {
    baseStatsTab.querySelector('[data-pokemon="hp"]').textContent = singlePokemonID.stats[0].base_stat;
    baseStatsTab.querySelector('[data-pokemon="attack"]').textContent = singlePokemonID.stats[1].base_stat;
    baseStatsTab.querySelector('[data-pokemon="defense"]').textContent = singlePokemonID.stats[2].base_stat;
    baseStatsTab.querySelector('[data-pokemon="special-attack"]').textContent = singlePokemonID.stats[3].base_stat;
    baseStatsTab.querySelector('[data-pokemon="special-defense"]').textContent = singlePokemonID.stats[4].base_stat;
    baseStatsTab.querySelector('[data-pokemon="speed"]').textContent = singlePokemonID.stats[5].base_stat;
}


function calculateBaseStatTotalValue(singlePokemonID) {
    let totalValue = 0;
    
    for (let index = 0; index < singlePokemonID.stats.length; index++) {
        let value = singlePokemonID.stats[index].base_stat;

        totalValue += value;
    }
    baseStatsTab.querySelector('[data-pokemon="total"]').textContent = totalValue;
}


function calculateBaseStatBars(singlePokemonID) {
    const maxValue = 255;

    baseStatsTab.querySelector('[data-pokemon="hp-bar"]').style.width = ((singlePokemonID.stats[0].base_stat / maxValue) * 100) + '%';
    baseStatsTab.querySelector('[data-pokemon="attack-bar"]').style.width = ((singlePokemonID.stats[1].base_stat / maxValue) * 100) + '%';
    baseStatsTab.querySelector('[data-pokemon="defense-bar"]').style.width = ((singlePokemonID.stats[2].base_stat / maxValue) * 100) + '%';
    baseStatsTab.querySelector('[data-pokemon="special-attack-bar"]').style.width = ((singlePokemonID.stats[3].base_stat / maxValue) * 100) + '%';
    baseStatsTab.querySelector('[data-pokemon="special-defense-bar"]').style.width = ((singlePokemonID.stats[4].base_stat / maxValue) * 100) + '%';
    baseStatsTab.querySelector('[data-pokemon="speed-bar"]').style.width = ((singlePokemonID.stats[5].base_stat / maxValue) * 100) + '%';
}


function addBackgroundToDialogStatBars(singlePokemonID) {
    const typeName = singlePokemonID.types[0].type.name;
    const currentTypeClass = `bg-${typeName}`;

    singlePokemonID.stats.forEach(data => {
        const statName = data.stat.name;
        const statBar = document.querySelector(`.dialog-stat-bar[data-pokemon="${statName}-bar"]`)

        if(statBar) {
            statBar.className = 'dialog-stat-bar';
            statBar.classList.add(currentTypeClass);
        }
    });
}


async function renderDialogMainTabBaseStats(id) {
    const singlePokemonID = allPokemonDetails.find(pokemon => pokemon.id === id);

    addPokemonBaseStatData(singlePokemonID);
    calculateBaseStatTotalValue(singlePokemonID);
    calculateBaseStatBars(singlePokemonID);
    addBackgroundToDialogStatBars(singlePokemonID);
}


async function fetchPokemonEvolutionChain(id) {
    const singlePokemonID = allPokemonSpeciesDetails.find(pokemon => pokemon.id === id);
    const evolutionChainURL = singlePokemonID.evolution_chain.url;

    try {
        const responseDetails = await fetch(evolutionChainURL);
        const pokemonEvolutionDetails = await responseDetails.json();

        pokemonEvolutionChain.push(pokemonEvolutionDetails);
        // return pokemonEvolutionChain;
    } catch (error) {
        console.log('Fehler beim Laden der Daten:', error);
    }
}


function addPokemonDataToEvolutionChain(allPokemonsFromChain) {
    const evolutionTabHeadline = '<h4>Evolution</h4>';
    let pokemonChain = [];

    evolutionTab.innerHTML = '';

    // allPokemonsFromChain.forEach(pokemonName => {
    //     const allPokemonsFromChainFound = allPokemonDetails.find(allPokemon => allPokemon.name === pokemonName);
    //     pokemonChain += getEvolutionChainTemplate(allPokemonsFromChainFound);
    //     evolutionTab.innerHTML = pokemonChain;
    // });

    for (let index = 0; index < allPokemonsFromChain.length; index++) {
        const pokemonNames = allPokemonsFromChain[index];
        const allPokemonsFromChainFound = allPokemonDetails.find(allPokemon => allPokemon.name === pokemonNames);
        const lastPokemon = (index === allPokemonsFromChain.length -1);
        pokemonChain += getEvolutionChainTemplate(allPokemonsFromChainFound, lastPokemon);
        
    }
    evolutionTab.innerHTML = evolutionTabHeadline + pokemonChain;
}


function checkEvolutionChain(id) {
    let allPokemonsFromChain = [];

    const singlePokemonID = allPokemonSpeciesDetails.find(pokemon => pokemon.id === id);
    
    const evolutionChainURLParts = singlePokemonID.evolution_chain.url.split('/').filter(part => part !== "");
    const filterEvolutionChainID = parseInt(evolutionChainURLParts[evolutionChainURLParts.length -1]);

    const findEvolutionChain = pokemonEvolutionChain.find(evolutionChain => evolutionChain.id === filterEvolutionChainID);

    const basicPokemon = findEvolutionChain.chain;
    allPokemonsFromChain.push(basicPokemon.species.name);

    if (basicPokemon.evolves_to && basicPokemon.evolves_to.length > 0) {
        basicPokemon.evolves_to.forEach(firstEvolution => {
            allPokemonsFromChain.push(firstEvolution.species.name);

            if (firstEvolution.evolves_to.forEach(secondEvolution => {
                allPokemonsFromChain.push(secondEvolution.species.name);
            }));
        });
    }
    addPokemonDataToEvolutionChain(allPokemonsFromChain);
}


async function renderDialogMainTabEvolution(id) {
    await fetchPokemonEvolutionChain(id);
    checkEvolutionChain(id);
}
