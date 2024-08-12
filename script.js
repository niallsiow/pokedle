const match_color = "rgb(50, 200, 50)";

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
    console.log(`color = ${pokemon.color}, habitat = ${pokemon.habitat}`);
}

function displayFinishDialog(end_text){
    const finish_dialog = document.getElementById("finish_dialog");
    const game_over_contents = document.getElementById("game_over_contents");
    game_over_contents.replaceChildren();
    
    const end_text_div = document.createElement("div");
    end_text_div.style.fontSize = "20px";
    end_text_div.style.fontWeight = "bold";
    end_text_div.textContent += end_text;
    game_over_contents.appendChild(end_text_div);

    const reveal_text_div = document.createElement("div");
    reveal_text_div.textContent += "The answer was:";
    game_over_contents.appendChild(reveal_text_div);

    const pokemon_image = document.createElement("img");
    pokemon_image.src = target_pokemon.image_url;
    game_over_contents.appendChild(pokemon_image);

    const pokemon_name = document.createElement("div");
    pokemon_name.style.fontSize = "18px";
    pokemon_name.textContent += `${capitalise(target_pokemon.name)}!`;
    game_over_contents.appendChild(pokemon_name);

    play_again_button.style.display = "block";

    finish_dialog.showModal();
}

let guesses = 0;
function checkGuess(guessed_pokemon){
    guesses += 1;

    if(guessed_pokemon.name == target_pokemon.name){
        displayFinishDialog("You Win!");
    }
    else if(guesses == 6){
        displayFinishDialog("You Lose...");
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

    const evolution_chain = {
        stage1: [],
        stage2: [],
        stage3: [],
    };

    const stage1 = pokemon_evolution_chain_data.chain;

    // read in all existing pokemon in evolution chain if they are in the pokemon list
    if(checkIfPokemonInList(stage1.species.name)){
        evolution_chain.stage1.push(stage1.species.name);
    }

    for(let i = 0; i < stage1.evolves_to.length; i++){
        const stage2 = stage1.evolves_to[i];
        if(checkIfPokemonInList(stage2.species.name)){
            evolution_chain.stage2.push(stage2.species.name);
        }
        for(let j = 0; j < stage2.evolves_to.length; j++){
            const stage3 = stage2.evolves_to[j];
            if(checkIfPokemonInList(stage3.species.name)){
                evolution_chain.stage3.push(stage3.species.name);
            }
        }
    }

    while(!evolution_chain.stage1.length){
        evolution_chain.stage1 = evolution_chain.stage2;
        evolution_chain.stage2 = evolution_chain.stage3;
        evolution_chain.stage3 = [];
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
    const pokemon_info = document.getElementById("pokemon_info");
    
    // pokemon name
    addDataToDisplay("pokemon-name", pokemon.name, target_pokemon.name, pokemon_info);

    // pokemon image
    const pokemon_image_div = document.createElement("div");
    const pokemon_image = document.createElement("img");
    pokemon_image.src = pokemon.image_url;
    pokemon_image_div.appendChild(pokemon_image);
    pokemon_image_div.classList.add("pokemon-image");
    if(pokemon.name == target_pokemon.name){
        pokemon_image.style.backgroundColor = match_color;
        pokemon_image_div.style.backgroundColor = match_color;
    }
    pokemon_info.appendChild(pokemon_image_div);

    // pokemon types
    addDataToDisplay("type-1", pokemon.type1, target_pokemon.type1, pokemon_info);
    addDataToDisplay("type-2", pokemon.type2, target_pokemon.type2, pokemon_info);

    // evolution info
    addDataToDisplay("evolution-stage", pokemon.evolution_stage, target_pokemon.evolution_stage, pokemon_info);
    addDataToDisplay("fully-evolved", pokemon.fully_evolved, target_pokemon.fully_evolved, pokemon_info);
    
    // color and habitat
    addDataToDisplay("color", pokemon.color, target_pokemon.color, pokemon_info);
    addDataToDisplay("habitat", pokemon.habitat, target_pokemon.habitat, pokemon_info);
    
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
            matching_pokemon.classList.add("search-result");

            
            // add event listener to allow selection from search results
            matching_pokemon.addEventListener("click", async () =>{
                current_pokemon_list[i] = "";
                search_results.replaceChildren();
                search.value = "";
                
                let pokemon = await getPokemon(i + 1);
                displayPokemonData(pokemon);

                checkGuess(pokemon);
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
    const play_dialog_contents = document.getElementById("play_dialog_contents");
    play_dialog_contents.replaceChildren();
    play_dialog_contents.textContent += "Fetching Random Target Pokemon...";
    play_button.style.display = "none";

    await populatePokemonList(151);
    current_pokemon_list = [...pokemon_list];

    // get target pokemon
    target_pokemon = await getPokemon(getRandomPokemonID());
    printPokemon(target_pokemon);

    play_dialog.close();
});

const play_again_button = document.getElementById("play_again_button");
play_again_button.addEventListener("click", async () => {
    const game_over_contents = document.getElementById("game_over_contents");
    game_over_contents.replaceChildren();
    game_over_contents.textContent = "Fetching New Target Pokemon...";
    play_again_button.style.display = "none";

    // clear all previous guesses
    const pokemon_info = document.getElementById("pokemon_info");
    const headers = document.querySelectorAll(".header");
    pokemon_info.replaceChildren(...headers);

    current_pokemon_list = [...pokemon_list];

    guesses = 0;

    // get new target pokemon
    target_pokemon = await getPokemon(getRandomPokemonID());
    printPokemon(target_pokemon);

    const finish_dialog = document.getElementById("finish_dialog");
    finish_dialog.close();
});


