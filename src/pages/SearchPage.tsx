import Navbar from '../components/Navbar';
import SongsList from '../components/searchPage/SongsList';
import TopResults from '../components/searchPage/TopResults';
import Album from './searchPage/Album';
import Artist from './searchPage/Artist';

const SearchPage = () => {
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <section>
          <TopResults query="tataloo" />
        </section>
        <section>
          <SongsList query="tataloo" />
        </section>
      </div>
      <div>
        <Artist query="tataloo" />
        <Album query="tataloo" />
      </div>
    </>
  );
};
export default SearchPage;
