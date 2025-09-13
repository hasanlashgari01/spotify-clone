import { useState } from 'react';

const PlaylistSearch = () => {
  const [Full, setFull] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFull(e.target.value);
  };

  return (
    <div>
      <div>
        <div className="flex flex-col">
          <h2 className="ml-3 p-2 text-2xl font-bold text-white">
            Let's find something for your playlist
          </h2>
          <div className="ml-3 flex w-[30%] items-center gap-2 rounded-xl bg-gray-600 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="h-5 w-5 text-white"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
            <input
              type="search"
              name="searcher"
              id="searcher"
              value={Full}
              onChange={handleChange}
              placeholder="Search for songs or episodes"
              className="h-full w-full border-none text-white outline-none"
            />
            <svg
              onClick={() => {
                if (Full) {
                  setFull('');
                }
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className={
                Full
                  ? 'h-7 w-7 cursor-pointer text-white opacity-100'
                  : 'h-7 w-7 text-white opacity-0'
              }
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
            </svg>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default PlaylistSearch;
