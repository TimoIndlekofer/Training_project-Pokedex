// ##### JavaScript file for templates #####

// Pokemon cards on main page: 

function getPokemonTemplate(pokemonDetails) {
    let pokemonTypes = `<span class="type-badge">${pokemonDetails.types[0].type.name}</span>`

    if (pokemonDetails.types.length > 1) {
        pokemonTypes += `<span class="type-badge">${pokemonDetails.types[1].type.name}</span>`
    }

    return `<button class="pokemon-card-small bg-${pokemonDetails.types[0].type.name}" data-id="card" onclick="renderPokemonInDialog(${pokemonDetails.id})">
                <span class="pokemon-card-small-id">#${pokemonDetails.id}</span>
                <span class="pokemon-card-small-name">${pokemonDetails.name}</span>

                <span class="pokemon-card-small-image-container">
                    <img src="${pokemonDetails.sprites.other.home.front_default}" alt="Pokemon picture" data-id="card-image">
                </span>

                <span class="pokemon-card-small-badge-container">
                    ${pokemonTypes}
                </span>
            </button>`
}


// Dialog:

function getHeaderDataTemplate(pokemonID, pokemonName, pokemonIMG, pokemonBadge, currentTypeClass) {
    return `<div class="dialog-header-top">
                    <span class="dialog-header-id" id="header-id">${pokemonID}</span>
                    <button class="dialog-header-close-button ${currentTypeClass}" id="header-close-button" data-id="close-dialog-button" onclick="closeDialog()">X</button>
                </div>
                <div class="dialog-header-bottom">
                    <h3 id="header-name">${pokemonName}</h3>
                    <div class="dialog-header-bottom-badges-container">
                        <span class="type-badge" id="header-badge1">${pokemonBadge}</span>
                        <span class="type-badge" id="header-badge2"></span>
                    </div>
                    <img src="${pokemonIMG}" alt="Pokemon picture" class="dialog-img" id="header-img" data-id="dialog-image">
            </div>`
}


function getBasicDataTemplate(pokemonGenus, pokemonHeight, pokemonWeight, pokemonAbilities) {
    return `<dt>Species</dt>
                        <dd>${pokemonGenus}</dd>

                        <dt>Height</dt>
                        <dd>${pokemonHeight}</dd>

                        <dt>Weight</dt>
                        <dd>${pokemonWeight}</dd>

                        <dt>Abilities</dt>
                        <dd>${pokemonAbilities}</dd>`
}


function getTrainingDataTemplate(pokemonCaptureRate, pokemonBaseExperience, pokemonGrowth) {
    return `<dt>Catch rate</dt>
                        <dd>${pokemonCaptureRate}</dd>

                        <dt>Base exp.</dt>
                        <dd>${pokemonBaseExperience}</dd>

                        <dt>Growth</dt>
                        <dd>${pokemonGrowth}</dd>`
}


function getEnvironmentDataTemplate(eggGroup, habitatName) {
    return `<dt>Egg groups</dt>
                        <dd>${eggGroup}</dd>

                        <dt>Habitat</dt>
                        <dd>${habitatName}</dd>`
}


function getBaseStatsDataTemplate(baseStatHP, baseStatAttack, baseStatDefense, baseStatSpecialAttack, baseStatSpecialDefense, baseStatSpeed, totalBaseStatsValue, currentTypeClass) {
    return `<dt>HP</dt>
                        <dd>
                            <span class="dialog-stat-value" data-pokemon="hp">${baseStatHP}</span>
                            <div class="dialog-stat-bar-container">
                                <div class="dialog-stat-bar ${currentTypeClass}" style="width: ${baseStatHP + '%'}"></div>
                            </div>
                        </dd>
                        <dt>Attack</dt>
                        <dd>
                            <span class="dialog-stat-value" data-pokemon="attack">${baseStatAttack}</span>
                            <div class="dialog-stat-bar-container">
                                <div class="dialog-stat-bar ${currentTypeClass}" style="width: ${baseStatAttack + '%'}"></div>
                            </div>
                        </dd>
                        <dt>Defense</dt>
                        <dd>
                            <span class="dialog-stat-value" data-pokemon="defense">${baseStatDefense}</span>
                            <div class="dialog-stat-bar-container">
                                <div class="dialog-stat-bar ${currentTypeClass}" style="width: ${baseStatDefense + '%'}"></div>
                            </div>
                        </dd>
                        <dt>Sp. Attack</dt>
                        <dd>
                            <span class="dialog-stat-value" data-pokemon="special-attack">${baseStatSpecialAttack}</span>
                            <div class="dialog-stat-bar-container">
                                <div class="dialog-stat-bar ${currentTypeClass}" style="width: ${baseStatSpecialAttack + '%'}"></div>
                            </div>
                        </dd>
                        <dt>Sp. Defense</dt>
                        <dd>
                            <span class="dialog-stat-value" data-pokemon="special-defense">${baseStatSpecialDefense}</span>
                            <div class="dialog-stat-bar-container">
                                <div class="dialog-stat-bar ${currentTypeClass}" style="width: ${baseStatSpecialDefense + '%'}"></div>
                            </div>
                        </dd>
                        <dt>Speed</dt>
                        <dd>
                            <span class="dialog-stat-value" data-pokemon="speed">${baseStatSpeed}</span>
                            <div class="dialog-stat-bar-container">
                                <div class="dialog-stat-bar ${currentTypeClass}" style="width: ${baseStatSpeed + '%'}"></div>
                            </div>
                        </dd>
                        <div class="dialog-stat-line"></div>
                        <dt class="dialog-stat-total-label">Total</dt>
                        <dd>
                            <span class="dialog-stat-total-value">${totalBaseStatsValue}</span>
                        </dd>`
}


function getEvolutionChainTemplate(pokemon, lastPokemon) {
    const arrow = lastPokemon ? '' : `<div class="dialog-evolution-arrow-container">
                        <span class="dialog-evolution-arrow-icon">&darr;</span>
                    </div>`

    return `<!-- Evolution stage -->
                    <div class="dialog-evolution-stage-container">
                        <div class="dialog-evolution-img">
                            <img src="${pokemon.sprites.other.home.front_default}" alt="Pokemon picture">
                        </div>
                        <div class="dialog-evolution-details-container">
                            <span class="dialog-evolution-id">#${pokemon.id}</span>
                            <span class="dialog-evolution-name">${pokemon.name}</span>
                        </div>
                    </div>
                    <!-- Arrow -->
                    ${arrow}`
}
