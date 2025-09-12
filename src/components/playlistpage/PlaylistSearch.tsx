import { useState } from 'react';
import SearchcedSongs from './SearchedSongs';
import { Song, AllSongs } from '../../types/song.type';
import { songService } from '../../services/songService';
import Fuse from 'fuse.js';

interface Props {
  refFetch?: React.MutableRefObject<() => void>;
}

const PlaylistSearch: React.FC<Props> = ({ refFetch }) => {
  const [Full, setFull] = useState('');
  const [allResults, setAllResults] = useState<Song[]>([]);
  const [visibleResults, setVisibleResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const resultsPerPage = 8;
  const showMoreCount = 10;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFull(e.target.value);

  const handleSearch = async () => {
    if (!Full.trim()) {
      setAllResults([]);
      setVisibleResults([]);
      setMessage(null);
      return;
    }

    setLoading(true);
    setAllResults([]);
    setVisibleResults([]);
    setMessage(null);

    let page = 1;
    const limit = 40;
    let lastPage = false;
    let foundSongs: Song[] = [];

    try {
      while (!lastPage) {
        const data: AllSongs = await songService.getAllSongs(page, limit);
        lastPage = page >= data.pagination.pageCount;

        const fuse = new Fuse(data.songs, {
          keys: ['title', 'artist.fullName'],
          threshold: 0.4,
        });

        const results = fuse.search(Full);
        if (results.length > 0) {
          foundSongs = results.map(r => r.item);
          break;
        }

        page++;
      }

      if (foundSongs.length > 0) {
        setAllResults(foundSongs);
        setVisibleResults(foundSongs.slice(0, resultsPerPage));
      } else {
        setMessage('Nothing found');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    const currentCount = visibleResults.length;
    const nextResults = allResults.slice(currentCount, currentCount + showMoreCount);
    setVisibleResults([...visibleResults, ...nextResults]);
  };

  return (
    <div>
      <div className="flex flex-col items-center md:items-start">
        <h2 className="ml-3 p-2 text-2xl font-bold text-white">
          Let's find something for your playlist
        </h2>
        <div className="ml-3 flex w-[90%] md:w-[40%] items-center gap-2 rounded-xl bg-gray-600 p-3">
          <input
            type="search"
            value={Full}
            onChange={handleChange}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search for songs or episodes"
            className="h-full w-full border-none text-white outline-none"
          />

          <svg onClick={handleSearch} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-5 w-5 text-white cursor-pointer" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>
      </div>

      <div className="playlist-container flex flex-wrap gap-4 mt-4 flex-col items-center md:items-start">
        {loading && <p className="text-white">Loading...</p>}
        {visibleResults.length > 0 && <SearchcedSongs songs={visibleResults} refFetch={refFetch} />}
        {message && <p className="text-white">{message}</p>}

        {visibleResults.length < allResults.length && !loading && (
          <button onClick={handleShowMore} className="mt-4 p-2 border-2 border-white text-white rounded-xl cursor-pointer w-30">
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default PlaylistSearch;
