export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonWithDetails extends Pokemon {
  image: string;
  types: string[];
  isLoadingImage: boolean;
}

export interface PokemonByType {
  [key: string]: Pokemon[];
}

export interface PokemonSprites {
  back_default: string;
  back_female: null | string;
  back_shiny: string;
  back_shiny_female: null | string;
  front_default: string;
  front_female: null | string;
  front_shiny: string;
  front_shiny_female: null | string;
  other: PokemonOther;
}

export interface PokemonOther {
  dream_world: {
    front_default: string;
    front_female: null | string;
  };
  home: {
    front_default: string;
    front_female: null | string;
    front_shiny: string;
    front_shiny_female: null | string;
  };
  "official-artwork": {
    front_default: string;
    front_shiny: string;
  };
  showdown: {
    back_default: string;
    back_female: null | string;
    back_shiny: string;
    back_shiny_female: null | string;
    front_default: string;
    front_female: null | string;
    front_shiny: string;
    front_shiny_female: null | string;
  };
}

export interface PokemonDetailsResponse {
  types: { type: PokemonType }[];
  sprites: PokemonSprites;
}
