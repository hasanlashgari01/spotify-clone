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
          <TopResults title="Timar" artist="Amir Tataloo" onClick={() => {}} />
        </section>
        <section>
          <SongsList />
        </section>
      </div>
          <div>
      <Artist />
      <Album />
    </div>
    </>
  );
};
export default SearchPage;
