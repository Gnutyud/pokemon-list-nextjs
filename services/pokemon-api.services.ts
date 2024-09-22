import { POKEMON_API_URL } from "@/constants/pokemon";
import { Pokemon, PokemonDetailsResponse, PokemonType } from "@/types/pokemon";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: POKEMON_API_URL,
});

axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export const pokemonServices = {
  getPokemonList: (requestParams: {
    limit?: number;
    offset?: number;
  }): Promise<{ results: Pokemon[] }> => {
    return axiosClient.get("/pokemon", { params: requestParams });
  },
  getPokemonTypes: (): Promise<{ results: PokemonType[] }> => {
    return axiosClient.get("/type");
  },
  getPokemonDetails: (url: string): Promise<PokemonDetailsResponse> => {
    return axiosClient.get(url);
  },
  getPokemonByType: (
    url: string
  ): Promise<{ name: string; pokemon: { pokemon: Pokemon }[] }> => {
    return axiosClient.get(url);
  },
};
