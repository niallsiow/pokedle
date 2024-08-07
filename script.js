function capitalise(s){
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function getRandomPokemonID(){
    return Math.floor(Math.random() * 151) + 1;
}

async function getAllPokemonNames(max){
    // add a map of genname to max pokedex value here

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${max.toString()}/`);
    const pokemon_data = await response.json();

    for(let i = 0; i < pokemon_data.results.length; i++){
        pokemon.push(pokemon_data.results[i].name);
    }
}

async function getPokemonData(id){
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id.toString()}/`);
    const pokemon_data = await response.json();

    return pokemon_data;
}

async function getPokemonSpeciesData(id){
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id.toString()}/`);
    const species_data = await response.json();

    return species_data;
}

async function getPokemonEvolutionData(id){

}

function displayPokemonData(pokemon_data){
    const pokemon_name = document.getElementById("pokemon_name");
    const pokemon_image = document.getElementById("pokemon_image");
    const pokemon_type_1 = document.getElementById("type-1");
    const pokemon_type_2 = document.getElementById("type-2");

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
    const pokemon_data = await getPokemonData(id);

    const pokemon_species_data = await getPokemonSpeciesData(id);
    
    console.log("pokemon species");
    console.log(pokemon_species_data);

    console.log(pokemon_species_data.evolution_chain.url);

    // // evolution info
    // const evolution_response = await fetch(pokemon_species_data.evolution_chain.url);
    // const evolution_chain_data = await evolution_response.json();

    // console.log("evolution chain");
    // console.log(evolution_chain_data);
    // console.log(evolution_chain_data.chain);

    // for evolution stage -> if len(evolvesfrom == 0, stage 1, if == 1, stage 2, if == 2, stage 3)
    // -> if len(evolvesto >= 1, not fully evolved, if == 0, fully evolved)

    displayPokemonData(pokemon_data);
}



// Main
const image_div = document.getElementById("image_div");
const show_button = document.getElementById("show_button");

show_button.addEventListener("click", () => {
    image_div.style.display = "block";
});

// populate pokemon array
const pokemon = [];
getAllPokemonNames(151);

// pokemon search logic
const search = document.getElementById("search");
const search_results = document.getElementById("search_results");

search.addEventListener("input", () => {
    search_results.replaceChildren();

    for(let i = 0; i < pokemon.length; i++){

        if(search.value.length == 0){
            continue;
        }

        let j = 0;
        let match = true;
        while(j < search.value.length && j < pokemon[i].length){
            if(search.value[j] != pokemon[i][j]){
                match = false;
                break;
            }

            j += 1;
        }

        if(match){
            // add pokemon to search results
            const matching_pokemon = document.createElement("div");
            matching_pokemon.textContent += pokemon[i];
            search_results.appendChild(matching_pokemon);
        }
    }
});




getPokemon(getRandomPokemonID());