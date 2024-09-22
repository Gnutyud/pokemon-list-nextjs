"use client";

import { pokemonServices } from "@/services/pokemon-api.services";
import {
  Pokemon,
  PokemonByType,
  PokemonType,
  PokemonWithDetails,
} from "@/types/pokemon";
import { useEffect, useState } from "react";
import Image from "next/image";
import { filterPokemonsByTypes } from "@/utils/pokemon";

const PokemonList: React.FC = () => {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [pokemonList, setPokemonList] = useState<PokemonWithDetails[]>([]);
  const [types, setTypes] = useState<PokemonType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allPokemonsByType, setAllPokemonsByType] = useState<Record<
    string,
    Pokemon[]
  > | null>(null);

  const limit = 48;

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const pokemonListData = await pokemonServices.getPokemonList({
          limit: 1200,
        });
        setAllPokemon(pokemonListData.results);
        setFilteredPokemon(pokemonListData.results);
        setTotalResults(pokemonListData.results.length);

        // Fetch all pokemons by type
        const allTypes = await fetchAllPokemonsByType();
        setAllPokemonsByType(allTypes);

        // Fetch details for the first page
        fetchPokemonDetails(pokemonListData.results.slice(0, limit));
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle type filter changes
  useEffect(() => {
    if (selectedTypes.length > 0 && allPokemonsByType) {
      const filteredByTypes = filterPokemonsByTypes(
        allPokemonsByType,
        selectedTypes
      );
      setFilteredPokemon(filteredByTypes);
      setTotalResults(filteredByTypes.length);
      fetchPokemonDetails(filteredByTypes.slice(0, limit));
    } else {
      setFilteredPokemon(allPokemon);
      setTotalResults(allPokemon.length);
      fetchPokemonDetails(allPokemon.slice(0, limit));
    }
  }, [selectedTypes]);

  // Handle pagination
  useEffect(() => {
    if (filteredPokemon.length > 0) {
      const startIndex = (currentPage - 1) * limit;
      const paginatedPokemon = filteredPokemon.slice(
        startIndex,
        startIndex + limit
      );
      fetchPokemonDetails(paginatedPokemon);
    }
  }, [currentPage, filteredPokemon]);

  const fetchPokemonDetails = async (pokemonSubset: Pokemon[]) => {
    setIsLoading(true);
    try {
      const detailedPokemonList = await Promise.all(
        pokemonSubset.map(async (pokemon) => {
          const pokemonDetails = await pokemonServices.getPokemonDetails(
            pokemon.url
          );
          const types = pokemonDetails.types.map(
            (type: { type: PokemonType }) => type.type.name
          );
          return {
            name: pokemon.name,
            url: pokemon.url,
            image:
              pokemonDetails.sprites.other["official-artwork"].front_default,
            types: types,
            isLoadingImage: true,
          };
        })
      );

      setPokemonList(detailedPokemonList);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPokemonsByType = async (): Promise<PokemonByType> => {
    const response = await pokemonServices.getPokemonTypes();
    setTypes(response.results);
    const allPokemons: PokemonByType = {};

    // Fetch Pokémon for each type
    for (const type of response.results) {
      const typeResponse = await pokemonServices.getPokemonByType(type.url);
      // const typeData = typeResponse.data;
      allPokemons[type.name] = typeResponse.pokemon.map((p) => ({
        name: p.pokemon.name,
        url: p.pokemon.url,
      }));
    }

    return allPokemons;
  };

  const handleTypeToggle = (type: string) => {
    setCurrentPage(1); // Reset to page 1 when filtering
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleNextPage = () => {
    if (!isLoading && currentPage < Math.ceil(totalResults / limit)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (!isLoading && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleImageLoad = (pokemonName: string) => {
    setPokemonList((prevList) =>
      prevList.map((pokemon) =>
        pokemon.name === pokemonName
          ? { ...pokemon, isLoadingImage: false }
          : pokemon
      )
    );
  };

  return (
    <div>
      <div className="mx-auto max-w-screen-xl">
        {/* Filter by Types */}
        <div className="flex items-center mx-4 my-4">
          <div className="mr-2 my-4 font-bold self-start">Types:</div>
          <div>
            {types.map((type) => (
              <button
                key={type.name}
                onClick={() => handleTypeToggle(type.name)}
                className={`px-4 py-2 rounded-lg ${
                  selectedTypes.includes(type.name)
                    ? "px-2 py-2 mx-2 my-2 border-red-900 border-2 rounded-md font-bold text-white bg-red-900"
                    : "px-2 py-2 mx-2 my-2 border-red-900 border-2 rounded-md font-bold text-red-900"
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
        {pokemonList.length > 0 && (
          <div className="my-12 mx-4 font-bold">
            {totalResults} results found.
          </div>
        )}
      </div>
      {pokemonList.length === 0 && (
        <div className="text-center text-3xl mx-auto my-24 font-bold">
          No results found.
        </div>
      )}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {!isLoading &&
          pokemonList.map((pokemon) => (
            <div key={pokemon.name}>
              <div className="h-24 w-24 mx-auto">
                {pokemon.isLoadingImage && <span>Loading...</span>}
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                  onLoad={() => handleImageLoad(pokemon.name)}
                />
              </div>
              <div className="text-center">{pokemon.name}</div>
            </div>
          ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          className="p-2 bg-red-900 rounded-md text-white mr-4 disabled:opacity-40 disabled:cursor-not-allowed select-none"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Prev
        </button>
        <button
          className="p-2 bg-red-900 rounded-md text-white mr-4 disabled:opacity-40 disabled:cursor-not-allowed select-none"
          disabled={currentPage >= Math.ceil(totalResults / limit)}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PokemonList;
