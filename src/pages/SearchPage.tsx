import Navbar from '../components/Navbar';
import SongsList from '../components/searchPage/SongsList';
import TopResults from '../components/searchPage/TopResults';
import Album from '../components/searchPage/Album';
import Artist from '../components/searchPage/Artist';
import ToolSearch from '../components/searchPage/ToolSearch';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const categories = ['All','Songs','Profiles','Artists','Albums','Playlists','Podcasts'] as const;
type Category = typeof categories[number];

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const query = useMemo(() => params.get('q') || '', [params]);

  useEffect(() => {
    const cat = params.get('cat') as Category | null;
    if (cat && categories.includes(cat)) setActiveCategory(cat);
  }, [params]);

  useEffect(() => {
    setParams((p) => {
      const next = new URLSearchParams(p);
      next.set('q', query);
      next.set('cat', activeCategory);
      return next;
    }, { replace: true });
  }, [activeCategory, query, setParams]);

  return (
    <>
      <Navbar />
      {/* Page entrance animation */}
      <div className="animate-[fadeIn_400ms_ease-out]">
        <style>
          {`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}
        </style>
        <ToolSearch /* controlled via URL params */ />

        {(activeCategory === 'All' || activeCategory === 'Songs') && (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            <section>
              <TopResults query={query} />
            </section>
            <section>
              <SongsList query={query} />
            </section>
          </div>
        )}

        {(activeCategory === 'All' || activeCategory === 'Artists') && (
          <div>
            <Artist query={query} />
          </div>
        )}

        {(activeCategory === 'All' || activeCategory === 'Albums' || activeCategory === 'Playlists') && (
          <div>
            <Album query={query} />
          </div>
        )}
      </div>
    </>
  );
};
export default SearchPage;
