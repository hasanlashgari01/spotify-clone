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
    <div className="p-20">

      <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-hide rounded-xl">
        {musics.slice(0, 5).map((music, index) => (
          <div key={index} className="mb-4">
            <SingleArtMusic title={music.title} artist={music.artist} />
          </div>
        ))}


        {musics.length > 5 &&
          musics.slice(5).map((music, index) => (
            <div key={`extra-${index}`} className="mb-4">
              <SingleArtMusic title={music.title} artist={music.artist} />
            </div>
          ))}
      </div>
    </div>
  );
};
