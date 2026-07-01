// ##### JavaScript file for all functions in dialog #####

const dialogBox = document.getElementById('dialog-pokemon-details');
const headerContainer = document.getElementById('header-container');
const headerCloseButton = document.getElementById('header-close-button');
const dialogTabButtons = document.querySelectorAll('.dialog-tab-button');
const dialogTabContent = document.querySelectorAll('.dialog-tab-content');
const evolutionData = document.getElementById('data-evolution');
const backButton = document.getElementById('dialog-back-button');
const nextButton = document.getElementById('dialog-next-button');

let aboutTabBasicData = document.getElementById('tab-about-basic-data');
let aboutTabTrainingData = document.getElementById('tab-about-training-data');
let aboutTabEnvironmentData = document.getElementById('tab-about-environment-data');
let baseStatsData = document.getElementById('tab-base-stats-data');

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
    }
}


function closeDialogEscapeKey() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dialogBox.open) {
            closeDialog();
        }
    });
}


function getPokemonTypeClass(singlePokemonID) {
    const typeName = singlePokemonID.types[0].type.name;
    const currentTypeClass = `bg-${typeName}`;

    return currentTypeClass;
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


function checkBadgesInDialogHeader(singlePokemonID) {
    if (singlePokemonID.types.length === 1) {
        document.getElementById('header-badge2').textContent = '';
        document.getElementById('header-badge2').classList.add('dialog-header-badges-hidden');
    } else if (singlePokemonID.types.length > 1) {
        document.getElementById('header-badge2').classList.remove('dialog-header-badges-hidden');;
        document.getElementById('header-badge2').textContent = singlePokemonID.types[1].type.name;
    }
}


function addDataInDialogHeader(singlePokemonID) {
    headerContainer.innerHTML = '';

    const pokemonID = "#" + singlePokemonID.id;
    const pokemonName = singlePokemonID.name
    const pokemonIMG = singlePokemonID.sprites.other.home.front_default;
    const pokemonBadge = singlePokemonID.types[0].type.name;

    const currentTypeClass = getPokemonTypeClass(singlePokemonID);

    headerContainer.className = 'dialog-header-container ' + currentTypeClass;
    
    headerContainer.innerHTML = getHeaderDataTemplate(pokemonID, pokemonName, pokemonIMG, pokemonBadge, currentTypeClass);
}


function renderDialogHeader(id) {
    const singlePokemonID = allPokemonDetails.find(pokemon => pokemon.id === id);

    addDataInDialogHeader(singlePokemonID);
    checkBadgesInDialogHeader(singlePokemonID);
}


async function fetchPokemonSpeciesDetails(singlePokemonID) {
    const pokemonSpeciesDetailsAvailable = allPokemonSpeciesDetails.find(pokemon => pokemon.id === singlePokemonID.id);
    if (pokemonSpeciesDetailsAvailable) return pokemonSpeciesDetailsAvailable;

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


function addPokemonBasicData(speciesData, singlePokemonID) {
    aboutTabBasicData.innerHTML = '';
    
    const speciesDataEntry = speciesData.genera.find(data => data.language.name === 'en');

    const pokemonGenus = speciesDataEntry ? speciesDataEntry.genus : "Unknown";
    const pokemonHeight = (singlePokemonID.height / 10).toFixed(1).replace('.', ',') + " m";
    const pokemonWeight = (singlePokemonID.weight / 10).toFixed(1).replace('.', ',') + " kg";
    
    const pokemonAbilities = getPokemonAbilities(singlePokemonID.abilities);

    aboutTabBasicData.innerHTML = getBasicDataTemplate(pokemonGenus, pokemonHeight, pokemonWeight, pokemonAbilities);
}


function addPokemonTrainingData(speciesData, singlePokemonID) {
    aboutTabTrainingData.innerHTML = '';

    const pokemonCaptureRate = speciesData.capture_rate;
    const pokemonBaseExperience = singlePokemonID.base_experience + " EP";
    const pokemonGrowth = speciesData.growth_rate && speciesData.growth_rate.name ? speciesData.growth_rate.name.charAt(0).toUpperCase() + speciesData.growth_rate.name.slice(1) : "Unknown";

    aboutTabTrainingData.innerHTML = getTrainingDataTemplate(pokemonCaptureRate, pokemonBaseExperience, pokemonGrowth);
}


function addPokemonEnvironmentData(speciesData) {
    aboutTabEnvironmentData.innerHTML = '';

    const eggGroup = getPokemonEggGroups(speciesData);
    const habitatName = speciesData.habitat && speciesData.habitat.name ? speciesData.habitat.name.charAt(0).toUpperCase() + speciesData.habitat.name.slice(1) : "Unknown";

    aboutTabEnvironmentData.innerHTML = getEnvironmentDataTemplate(eggGroup, habitatName);
}


async function renderDialogMainTabAbout(id) {
    const singlePokemonID = allPokemonDetails.find(pokemon => pokemon.id === id);

    const speciesData = await fetchPokemonSpeciesDetails(singlePokemonID);

    addPokemonBasicData(speciesData, singlePokemonID);
    addPokemonTrainingData(speciesData, singlePokemonID);
    addPokemonEnvironmentData(speciesData);
}


function calculateBaseStatTotalValue(singlePokemonID) {
    let totalValue = 0;
    
    for (let index = 0; index < singlePokemonID.stats.length; index++) {
        let value = singlePokemonID.stats[index].base_stat;

        totalValue += value;
    }
    return totalValue;
}


function addPokemonBaseStatsData(singlePokemonID) {
    baseStatsData.innerHTML = '';

    const currentTypeClass = getPokemonTypeClass(singlePokemonID);
  
    const baseStatHP = singlePokemonID.stats[0].base_stat;
    const baseStatAttack = singlePokemonID.stats[1].base_stat;
    const baseStatDefense = singlePokemonID.stats[2].base_stat;
    const baseStatSpecialAttack = singlePokemonID.stats[3].base_stat;
    const baseStatSpecialDefense = singlePokemonID.stats[4].base_stat;
    const baseStatSpeed = singlePokemonID.stats[5].base_stat;
    const totalBaseStatsValue = calculateBaseStatTotalValue(singlePokemonID);

    baseStatsData.innerHTML = getBaseStatsDataTemplate(baseStatHP, baseStatAttack, baseStatDefense, baseStatSpecialAttack, baseStatSpecialDefense, baseStatSpeed, totalBaseStatsValue, currentTypeClass);
}


async function renderDialogMainTabBaseStats(id) {
    const singlePokemonID = allPokemonDetails.find(pokemon => pokemon.id === id);

    addPokemonBaseStatsData(singlePokemonID);
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

    if (singlePokemonID > 0) {
        const previousPokemonID = currentViewOfPokemons[singlePokemonID - 1];
        renderPokemonInDialog(previousPokemonID.id);
    }
}


function nextButtonInDialog() {
    const singlePokemonID = currentViewOfPokemons.findIndex(pokemon => Number(pokemon.id) === Number(currentPokemonID));

    if (singlePokemonID !== -1 && singlePokemonID < currentViewOfPokemons.length - 1) {
        const nextPokemonID = currentViewOfPokemons[singlePokemonID + 1];
        renderPokemonInDialog(nextPokemonID.id);
    }
}


function stopPropagationInDialog() {
    const dialogWrapper = document.querySelector('.dialog-wrapper');

    dialogWrapper.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}

