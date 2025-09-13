import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useMyPlaylists } from '../../hooks/useMyPlaylists';
import Error from './ErrorMessage';
import Loading from './loding';
import PlayListItem from './PlayListItem';
import { SlArrowRight } from 'react-icons/sl';
import CreatePlaylist from './CreatePlaylist';
import Modal from './Modal';
import CreatePlaylistForm from './CreatePlaylistForm';

const MyPlaylist: React.FC = () => {
  const { data, isLoading, error,refetch  } = useMyPlaylists();
    const [open, setOpen] = useState(false);
  if (error) return <Error {...error} />;

  return (
    <div className='w-full flex justify-center items-center'>
    <div className="h-[300px]sm:h-[333px] relative rounded-3xl border-4 border-blue-900 w-[93%]">
      <div className="mt-10 mb-[20px] flex items-center justify-between px-[20px] sm:mb-[40px] sm:pr-[77px]">
        <h2 className="text-lg font-bold text-white sm:text-2xl">
          My PlayLists
        </h2>
      </div>
      <button className="custom-prev hidden"></button>

      <button className="custom-next absolute top-[160px] right-0 z-10 cursor-pointer rounded-full sm:top-[180px] sm:h-[48px] sm:w-[48px] sm:p-6">
        <SlArrowRight color="white" size={20} />
      </button>

      <div className="relative mt-[30px] mr-6 mb-[10px] ml-[20px] flex sm:mt-[40px] sm:mb-[21px]">
        <div onClick={() => setOpen(true)}>
          <CreatePlaylist />
        </div>
        <div className="w-full overflow-hidden">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
              enabled: true,
            }}
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1.5, spaceBetween: 10 },
              480: { slidesPerView: 2, spaceBetween: 15 },
              640: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
              1440: { slidesPerView: 4, spaceBetween: 20 },
              1600: { slidesPerView: 5, spaceBetween: 20 },
            }}
            style={{ height: '240px', paddingBottom: '10px' }}
          >
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <SwiperSlide
                    key={i}
                    style={{ width: '210px', height: '240px' }}
                  >
                    <Loading />
                  </SwiperSlide>
                ))
              : data?.playlists.map((playlist) => (
                  <SwiperSlide
                    key={playlist.id}
                    style={{ width: '210px', height: '240px' }}
                  >
                    <PlayListItem {...playlist} />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      </div>
            <Modal open={open} onClose={() => setOpen(false)}>
        <CreatePlaylistForm
          onCancel={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            refetch();
          }}
        />
      </Modal>
    </div>
  </div>
  );
};

export default MyPlaylist;
