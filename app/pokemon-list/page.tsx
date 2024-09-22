"use client";

const PokemonList: React.FC = () => {
  return (
    <div>
      <div className="mx-auto max-w-screen-xl">
        <div className="flex items-center mx-4 my-4">
          <div className="mr-2 my-4 font-bold self-start">Types:</div>
          <div>
            <button className="px-2 py-2 mx-2 my-2 border-red-900 border-2 rounded-md font-bold text-white bg-red-900">
              Normal
            </button>
            <button className="px-2 py-2 mx-2 my-2 border-red-900 border-2 rounded-md font-bold text-red-900">
              Normal1
            </button>
          </div>
        </div>
        <div className="my-12 mx-4 font-bold">{4} results found.</div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div>
          <div className="h-24 w-24 mx-auto">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/759.png"
              alt="stufful"
              title="stufful"
              width="100"
              height="100"
              loading="lazy"
            />
          </div>
          <div className="text-center">stufful</div>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          className="p-2 bg-red-900 rounded-md text-white mr-4 disabled:opacity-40 disabled:cursor-not-allowed select-none"
          disabled={true}
        >
          Prev
        </button>
        <button
          className="p-2 bg-red-900 rounded-md text-white mr-4 disabled:opacity-40 disabled:cursor-not-allowed select-none"
          disabled={true}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PokemonList;
