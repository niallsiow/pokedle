// make a pokemon object?
// can then populate it with get pokemon, and pass it to display pokemon
// or populate with get pokemon, and make it the guess to match against

const match_color = "green";

function Pokemon(){
    this.name;
    this.image_url;
    this.type1;
    this.type2;

    this.evolution_stage;
    this.fully_evolved;

    this.color;
    this.habitat;
}

function printPokemon(pokemon){
    console.log(`name = ${pokemon.name}, type 1 = ${pokemon.type1}, type 2 = ${pokemon.type2}`);
    console.log(`image url = ${pokemon.image_url}`);
    console.log(`evolution stage = ${pokemon.evolution_stage}, fully evolved = ${pokemon.fully_evolved}`);
    console.log(`color = , habitat = `);
}

function checkGuess(guessed_pokemon){
    if(guessed_pokemon.name == target_pokemon.name){
        console.log("You Win!");
    }
}

function capitalise(s){
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function getRandomPokemonID(){
    return Math.floor(Math.random() * 151) + 1;
}

function checkIfPokemonInList(pokemon){
    for(let i = 0; i < pokemon_list.length; i++){
        if(pokemon == pokemon_list[i]){
            return true;
        }
    }
    return false;
}

async function populatePokemonList(max){
    // add a map of genname to max pokedex value here

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${max.toString()}/`);
    const pokemon_data = await response.json();

    for(let i = 0; i < pokemon_data.results.length; i++){
        pokemon_list.push(pokemon_data.results[i].name);
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

async function getPokemonSpeciesDataFromUrl(url){
    const response = await fetch(url);
    const species_data = await response.json();

    return species_data;
}

async function getPokemonEvolutionDataFromUrl(url){
    const response = await fetch(url);
    const evolution_chain_data = await response.json();

    return evolution_chain_data;
}

async function getPokemon(id){
    // fetch data
    const pokemon_data = await getPokemonData(id);
    const pokemon_species_data = await getPokemonSpeciesData(id);
    const pokemon_evolution_chain_data = await getPokemonEvolutionDataFromUrl(pokemon_species_data.evolution_chain.url);

    console.log(pokemon_species_data);

    const evolution_chain = {
        stage1: [],
        stage2: [],
        stage3: [],
    };

    evolution_chain.stage1.push(pokemon_evolution_chain_data.chain.species.name);

    for(let i = 0; i < pokemon_evolution_chain_data.chain.evolves_to.length; i++){
        evolution_chain.stage2.push(pokemon_evolution_chain_data.chain.evolves_to[i].species.name);
        for(let j = 0; j < pokemon_evolution_chain_data.chain.evolves_to[i].evolves_to.length; j++){
            evolution_chain.stage3.push(pokemon_evolution_chain_data.chain.evolves_to[i].evolves_to[j].species.name);
        }
    }

    // create new pokemon
    const pokemon = new Pokemon();
    pokemon.name = pokemon_data.name;
    pokemon.image_url = pokemon_data.sprites.front_default;
    pokemon.type1 = pokemon_data.types[0].type.name;
    pokemon.type2 = "None";
    if(pokemon_data.types.length > 1){
        pokemon.type2 = pokemon_data.types[1].type.name;
    }

    // find pokemon evolution stage
    for(let i = 0; i < evolution_chain.stage3.length; i++){
        if(pokemon.name == evolution_chain.stage3[i]){
            pokemon.evolution_stage = "3";
            break;
        }
    }
    for(let i = 0; i < evolution_chain.stage2.length; i++){
        if(pokemon.name == evolution_chain.stage2[i]){
            pokemon.evolution_stage = "2";
            break;
        }
    }
    for(let i = 0; i < evolution_chain.stage1.length; i++){
        if(pokemon.name == evolution_chain.stage1[i]){
            pokemon.evolution_stage = "1";
            break;
        }
    }

    pokemon.fully_evolved = "Yes";
    if(pokemon.evolution_stage == "2"){
        for(let i = 0; i < evolution_chain.stage3.length; i++){
            if(checkIfPokemonInList(evolution_chain.stage3[i])){
                pokemon.fully_evolved = "No";
                break;
            }
        }
    }
    else if(pokemon.evolution_stage == "1"){
        for(let i = 0; i < evolution_chain.stage2.length; i++){
            if(checkIfPokemonInList(evolution_chain.stage2[i])){
                pokemon.fully_evolved = "No";
                break;
            }
        }
    }

    // pokemon color and habitat
    pokemon.color = pokemon_species_data.color.name;
    pokemon.habitat = pokemon_species_data.habitat.name;

    return pokemon;
}

function addDataToDisplay(divname, content, target_content, display){
    const div = document.createElement("div");
    div.textContent = capitalise(content);
    div.classList.add(divname);
    if(content == target_content){
        div.style.backgroundColor = match_color;
    }
    display.appendChild(div);
}

function displayPokemonData(pokemon){
    const show_pokemon_name = document.getElementById("pokemon_name");
    const show_pokemon_image = document.getElementById("pokemon_image");
    const pokemon_info = document.getElementById("pokemon_info");

    
    
    // pokemon name
    addDataToDisplay("pokemon-name", pokemon.name, target_pokemon.name, pokemon_info);

    // pokemon types
    addDataToDisplay("type-1", pokemon.type1, target_pokemon.type1, pokemon_info);
    addDataToDisplay("type-2", pokemon.type2, target_pokemon.type2, pokemon_info);

    // evolution info
    addDataToDisplay("evolution-stage", pokemon.evolution_stage, target_pokemon.evolution_stage, pokemon_info);
    addDataToDisplay("fully-evolved", pokemon.fully_evolved, target_pokemon.fully_evolved, pokemon_info);
    
    // color and habitat
    addDataToDisplay("color", pokemon.color, target_pokemon.color, pokemon_info);
    addDataToDisplay("habitat", pokemon.habitat, target_pokemon.habitat, pokemon_info);
    
    // pokemon image
    const pokemon_image_div = document.createElement("div");
    const pokemon_image = document.createElement("img");
    pokemon_image.src = pokemon.image_url;
    pokemon_image_div.appendChild(pokemon_image);
    pokemon_image_div.classList.add("pokemon-image");
    if(pokemon.name == target_pokemon.name){
        pokemon_image_div.style.backgroundColor = match_color;
    }
    pokemon_info.appendChild(pokemon_image_div);
}

// Main
const play_dialog = document.getElementById("play_dialog");
play_dialog.showModal();


// pokemon search logic
const search = document.getElementById("search");
const search_results = document.getElementById("search_results");

search.addEventListener("input", () => {
    search_results.replaceChildren();

    for(let i = 0; i < current_pokemon_list.length; i++){
        if(search.value.length == 0 || current_pokemon_list[i] == ""){
            continue;
        }

        let j = 0;
        let match = true;
        while(j < search.value.length && j < current_pokemon_list[i].length){
            if(search.value[j] != current_pokemon_list[i][j]){
                match = false;
                break;
            }

            j += 1;
        }

        if(match){
            // add pokemon to search results
            const matching_pokemon = document.createElement("div");
            matching_pokemon.textContent += capitalise(current_pokemon_list[i]);

            
            // add event listener to allow selection from search results
            matching_pokemon.addEventListener("click", async () =>{
                let pokemon = await getPokemon(i + 1);
                displayPokemonData(pokemon);

                checkGuess(pokemon);

                current_pokemon_list[i] = "";
                search_results.replaceChildren();
                search.value = "";
            });


            search_results.appendChild(matching_pokemon);
        }
    }
});


let pokemon_list = [];
let current_pokemon_list = [];
let target_pokemon;

const play_button = document.getElementById("play_button");
play_button.addEventListener("click", async () => {
    play_button.style.display = "none";

    await populatePokemonList(151);
    current_pokemon_list = [...pokemon_list];

    // get target pokemon
    target_pokemon = await getPokemon(getRandomPokemonID());
    printPokemon(target_pokemon);

    play_dialog.close();
});


