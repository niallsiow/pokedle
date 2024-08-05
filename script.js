function capitalise(s){
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function getRandomPokemonID(){
    return Math.floor(Math.random() * 151) + 1;
}

async function getPokemonData(id){
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id.toString()}/`);
    const pokemon_data = await response.json();

    return pokemon_data;
}

async function getPokemonSpeciesData(id){

}

async function getPokemonEvolutionData(id){

}

function displayPokemonData(pokemon_data){
    let pokemon_name = document.getElementById("pokemon_name");
    let pokemon_image = document.getElementById("pokemon_image");
    let pokemon_type_1 = document.getElementById("type-1");
    let pokemon_type_2 = document.getElementById("type-2");

    // pokemon name
    pokemon_name.textContent = capitalise(pokemon_data.name);

    // pokemon image
    pokemon_image.src = pokemon_data.sprites.front_default;

    // pokemon types
    pokemon_type_1.textContent = pokemon_data.types[0].type.name;
    if(pokemon_data.types.length == 1){
        pokemon_type_2.textContent = "N/A";
    }
    else{
        pokemon_type_2.textContent += pokemon_data.types[1].type.name;
    }
}

async function getPokemon(id){
    let pokemon_data = await getPokemonData(id);

    
    // // species info
    // const species_response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id.toString()}/`);
    // const pokemon_species_data = await species_response.json();
    
    // console.log("pokemon species");
    // console.log(pokemon_species_data);

    // pokemon_species_data.evolution_chain.url

    // // evolution info
    // const evolution_response = await fetch(pokemon_species_data.evolution_chain.url);
    // const evolution_chain_data = await evolution_response.json();

    // console.log("evolution chain");
    // console.log(evolution_chain_data);
    // console.log(evolution_chain_data.chain);

    displayPokemonData(pokemon_data);
}



// Main
let image_div = document.getElementById("image_div");
let show_button = document.getElementById("show_button");

show_button.addEventListener("click", () => {
    image_div.style.display = "block";
});


getPokemon(getRandomPokemonID());