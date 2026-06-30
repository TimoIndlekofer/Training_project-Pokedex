// ##### JavaScript file for all functions in dialog #####

const dialogBox = document.getElementById('dialog-pokemon-details');
const headerContainer = document.getElementById('header-container');
const headerCloseButton = document.getElementById('header-close-button');
const dialogTabButtons = document.querySelectorAll('.dialog-tab-button');
const dialogTabContent = document.querySelectorAll('.dialog-tab-content');
const aboutTab = document.getElementById('tab-about');
const baseStatsTab = document.getElementById('tab-base-stats');
const evolutionTab = document.getElementById('tab-evolution');
const backButton = document.getElementById('dialog-back-button');
const nextButton = document.getElementById('dialog-next-button');
const evolutionData = document.getElementById('data-evolution');

let currentPokemonID = 0;
let allPokemonSpeciesDetails = [];
let pokemonEvolutionChain = [];





// Functions:

function showPokemonDetailsInDialog() {
    document.documentElement.classList.add('dialog-no-scroll');
    dialogBox.showModal();
}


function toggleDialogTabs() {
    const activeButton = event.target.id;
    const activeTab = event.target.dataset.tab;

    dialogTabButtons.forEach(button => {        
        button.classList.toggle('active', button.id === activeButton);
    });

    dialogTabContent.forEach(tab => {
        tab.classList.toggle('active', tab.id === activeTab);
    });
}


function backToDialogTabAbout() {
    dialogTabButtons.forEach(button => {        
        button.classList.toggle('active', button.id === 'dialog-about-button');
    });

    dialogTabContent.forEach(tab => {
        tab.classList.toggle('active', tab.id === 'tab-about');
    });
}


function closeDialog() {
    backToDialogTabAbout();

    document.documentElement.classList.remove('dialog-no-scroll');
    dialogBox.close();
    clearDataInDialogTabAbout();
}


function initDialogBackdropClick() {
    dialogBox.addEventListener('click', closeDialogOnBackdropClick);

    dialogBox.addEventListener('close', () => {
        document.documentElement.classList.remove('dialog-no-scroll');
    });
}


function closeDialogOnBackdropClick(event) {
    backToDialogTabAbout();

    if (event.target === dialogBox) {
        dialogBox.close();
        document.documentElement.classList.remove('dialog-no-scroll');
        clearDataInDialogTabAbout();
    }
}


function closeDialogEscapeKey() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dialogBox.open) {
            closeDialog();
        }
    });
}


async function renderPokemonInDialog(id) { 
    currentPokemonID = Number(id);
    
    showPokemonDetailsInDialog();
    renderDialogHeader(id);
    await renderDialogMainTabAbout(id);
    renderDialogMainTabBaseStats(id);
    renderDialogMainTabEvolution(id);
    checkBackButtonInDialog();
    checkNextButtonInDialog();
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

    for (let index = 0; index < allTypes.length; index++) {
        const className = 'bg-' + allTypes[index];

        headerContainer.classList.remove(className);
        headerCloseButton.classList.remove(className);        
    }
    headerContainer.classList.add('bg-' + typeName);
    headerCloseButton.classList.add('bg-' + typeName);
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
    } catch (error) {
        console.log('Fehler beim Laden der Daten:', error);
    }
}


function searchAllPokemonsInEvolutionChain(basicPokemon, allPokemonsFromChain) {
    if (basicPokemon.evolves_to && basicPokemon.evolves_to.length > 0) {
        const firstEvolution = basicPokemon.evolves_to[0];
        allPokemonsFromChain.push(firstEvolution.species.name);

        if (firstEvolution.evolves_to && firstEvolution.evolves_to.length > 0) {
            const secondEvolution = firstEvolution.evolves_to[0];
            allPokemonsFromChain.push(secondEvolution.species.name);
        }
    }
}


async function getPokemonDataForEvolutionChain(allPokemonsFromChain) {
    let pokemonDataForEvolutionChain = [];
    
    for (let index = 0; index < allPokemonsFromChain.length; index++) {
        const name = allPokemonsFromChain[index];

        try {
            const responseDetails = await fetch('https://pokeapi.co/api/v2/pokemon/' + name);
            const pokemonDetails = await responseDetails.json();
            pokemonDataForEvolutionChain.push(pokemonDetails);
        } catch (error) {
            console.log('Fehler beim Laden der Daten:', error);
        }
    }
    addPokemonDataToEvolutionChain(pokemonDataForEvolutionChain);
}


function addPokemonDataToEvolutionChain(pokemonDataForEvolutionChain) {
    let pokemonChain = [];

    evolutionData.innerHTML = '';

    for (let index = 0; index < pokemonDataForEvolutionChain.length; index++) {
        const pokemon = pokemonDataForEvolutionChain[index];
        const lastPokemon = (index === pokemonDataForEvolutionChain.length -1);
        pokemonChain += getEvolutionChainTemplate(pokemon, lastPokemon);
    }
    evolutionData.innerHTML = pokemonChain;
}


function checkEvolutionChain(id) {
    let allPokemonsFromChain = [];

    const singlePokemonID = allPokemonSpeciesDetails.find(pokemon => pokemon.id === id);
    
    const evolutionChainURLParts = singlePokemonID.evolution_chain.url.split('/').filter(part => part !== "");
    const filterEvolutionChainID = parseInt(evolutionChainURLParts[evolutionChainURLParts.length -1]);

    const findEvolutionChain = pokemonEvolutionChain.find(evolutionChain => evolutionChain.id === filterEvolutionChainID);

    const basicPokemon = findEvolutionChain.chain;
    allPokemonsFromChain.push(basicPokemon.species.name);

    searchAllPokemonsInEvolutionChain(basicPokemon, allPokemonsFromChain);
    getPokemonDataForEvolutionChain(allPokemonsFromChain);
}


async function renderDialogMainTabEvolution(id) {
    await fetchPokemonEvolutionChain(id);
    checkEvolutionChain(id);
}


function checkBackButtonInDialog() {
    const singlePokemonID = currentViewOfPokemons.findIndex(pokemon => Number(pokemon.id) === Number(currentPokemonID));

    if (singlePokemonID === 0) {
        backButton.disabled = true;
        backButton.classList.add('deactivate');
    } else {
        backButton.disabled = false;
        backButton.classList.remove('deactivate');        
    }
}


function checkNextButtonInDialog() {
    const singlePokemonID = currentViewOfPokemons.findIndex(pokemon => Number(pokemon.id) === Number(currentPokemonID));

    if (singlePokemonID === currentViewOfPokemons.length - 1 || singlePokemonID === -1) {
        nextButton.disabled = true;
        nextButton.classList.add('deactivate');
    } else {
        nextButton.disabled = false;
        nextButton.classList.remove('deactivate');
    }
}


function backButtonInDialog() {
    const singlePokemonID = currentViewOfPokemons.findIndex(pokemon => Number(pokemon.id) === Number(currentPokemonID));
    clearDataInDialogTabAbout();

    if (singlePokemonID > 0) {
        const previousPokemonID = currentViewOfPokemons[singlePokemonID - 1];
        renderPokemonInDialog(previousPokemonID.id);
    }
}


function nextButtonInDialog() {
    const singlePokemonID = currentViewOfPokemons.findIndex(pokemon => Number(pokemon.id) === Number(currentPokemonID));
    clearDataInDialogTabAbout();

    if (singlePokemonID !== -1 && singlePokemonID < currentViewOfPokemons.length - 1) {
        const nextPokemonID = currentViewOfPokemons[singlePokemonID + 1];
        renderPokemonInDialog(nextPokemonID.id);
    }
}


function clearDataInDialogTabAbout() {
    const aboutTabData = document.querySelectorAll('[data-pokemon]');

    for (let index = 0; index < aboutTabData.length; index++) {
        aboutTabData[index].innerText = '';;        
    }
}


function stopPropagationInDialog() {
    const dialogWrapper = document.querySelector('.dialog-wrapper');

    dialogWrapper.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}