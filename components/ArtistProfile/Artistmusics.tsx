import { SingleArtMusic } from './compose/Single-artist.tsx';

type Props = {
  loading: boolean;
};

const musics = [
  { title: 'hello', artist: 'Reza Pishro' },
  { title: 'e=mc^2', artist: 'Reza Pishro' },
  { title: 'hello', artist: 'Reza Pishro' },
  { title: 'hello', artist: 'Reza Pishro' },
  { title: 'hello', artist: 'Reza Pishro' },
  { title: 'extra track 1', artist: 'Reza Pishro' },
  { title: 'extra track 2', artist: 'Reza Pishro' },
];

export const ArtistMusics = ({ loading }: Props) => {
  if (loading) return <></>;

  return (
    <div className="rounded-2xl bg-gradient-to-b  from-[#081124] to-[#000a18] p-6 sm:p-10 md:p-16 lg:p-20 shadow-[0_0_40px_rgba(0,70,255,0.25)] text-blue-100">
      <h2 className="mb-6 text-2xl font-bold tracking-wide text-blue-300">
        Top Tracks
      </h2>

      {/* background ثابت */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0a1a3a]/70 to-[#001229]/80 p-6 shadow-[0_0_20px_rgba(0,40,255,0.2)] backdrop-blur-md max-h-[500px] overflow-y-auto scrollbar-hide hover:scrollbar-thumb-blue-500 transition-all">
        {musics.map((music, index) => (
          <div
            key={index}
            className="mb-4 rounded-xl p-4 transition-transform duration-300 hover:scale-[1.015]"
          >
            <SingleArtMusic title={music.title} artist={music.artist} />
          </div>
        ))}
      </div>
    </div>
  );
};
