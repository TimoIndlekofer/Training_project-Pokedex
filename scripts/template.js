// ##### JavaScript file for templates #####

// Alles OK:
// function getPokemonTemplate(pokemonDetails) {
//     let pokemonTypes = `<span class="type-badge">${pokemonDetails.types[0].type.name}</span>`

//     if (pokemonDetails.types.length > 1) {
//         pokemonTypes += `<span class="type-badge">${pokemonDetails.types[1].type.name}</span>`
//     }

//     return `<button class="pokemon-card-small bg-${pokemonDetails.types[0].type.name}" data-id="card">
//                 <span class="pokemon-card-small-id">#${pokemonDetails.id}</span>
//                 <span class="pokemon-card-small-name">${pokemonDetails.name}</span>

//                 <span class="pokemon-card-small-image-container">
//                     <img src="${pokemonDetails.sprites.other.home.front_default}" alt="Pokemon picture">
//                 </span>

//                 <span class="pokemon-card-small-badge-container">
//                     ${pokemonTypes}
//                 </span>
//             </button>`
// }











// Test - Auch hier alles OK:
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