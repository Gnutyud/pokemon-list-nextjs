import { Pokemon, PokemonByType } from "@/types/pokemon";

export const filterPokemonsByTypes = (allPokemons: PokemonByType, selectedTypes: string[]): Pokemon[] => {
    const filteredPokemons = new Set<Pokemon>();

    // Create a map to track Pokémon that belong to all selected types
    const typeToPokemonsMap: { [key: string]: { count: number; url: string } } = {};

    // Initialize the map
    for (const type of selectedTypes) {
        if (allPokemons[type]) {
            allPokemons[type].forEach(pokemon => {
                const pokemonName = pokemon.name;
                if (!typeToPokemonsMap[pokemonName]) {
                    typeToPokemonsMap[pokemonName] = { count: 0, url: pokemon.url };
                }
                typeToPokemonsMap[pokemonName].count++;
            });
        }
    }

    // Find Pokémon that belong to all selected types
    const requiredTypeCount = selectedTypes.length;
    for (const [pokemon, data] of Object.entries(typeToPokemonsMap)) {
        if (data.count === requiredTypeCount) {
            filteredPokemons.add({ name: pokemon, url: data.url });
        }
    }

    return Array.from(filteredPokemons);
}