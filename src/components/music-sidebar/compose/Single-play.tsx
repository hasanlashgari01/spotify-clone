import DefaultPicture from "../../../../public/default-avatar.webp"
type singleProps = {
    playlistName : string;
    playlistSongs : string;
    fullimize : boolean;
    cover : string;
}
const SinglePlaylist = ({playlistName , playlistSongs , cover , fullimize}:singleProps) => {
  return (
    <div className='p-3 w-full flex gap-2 hover:bg-gray-600/30 cursor-pointer transition-all'>
        <img src={cover} alt="" className=' h-12 rounded-lg w-fit' />
        {!fullimize && (<div className='w-full text-white'>
          <div className='text-md'>
              {playlistName}
          </div>
          <div className='text-sm text-gray-400'>
            {playlistSongs}
          </div>
        </div>)}
      </div>
  )
}

export default SinglePlaylist
