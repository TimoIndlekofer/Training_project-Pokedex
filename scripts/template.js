// ##### JavaScript file for templates #####

function getPokemonTemplate(pokemonDetails) {
    let pokemonTypes = `<span class="type-badge">${pokemonDetails.types[0].type.name}</span>`

    if (pokemonDetails.types.length > 1) {
        pokemonTypes += `<span class="type-badge">${pokemonDetails.types[1].type.name}</span>`
    }

    return `<button class="pokemon-card-small bg-${pokemonDetails.types[0].type.name}" data-id="card" onclick="renderPokemonInDialog(${pokemonDetails.id})">
                <span class="pokemon-card-small-id">#${pokemonDetails.id}</span>
                <span class="pokemon-card-small-name">${pokemonDetails.name}</span>

                <span class="pokemon-card-small-image-container">
                    <img src="${pokemonDetails.sprites.other.home.front_default}" alt="Pokemon picture">
                </span>

                <span class="pokemon-card-small-badge-container">
                    ${pokemonTypes}
                </span>
            </button>`
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
