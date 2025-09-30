import MyPlaylists from '../components/MyPlayLists/MyPlaylist';
import UserInfo from '../components/profilePage/UserInfo';
import FollowingCard from '../components/profilePage/FollowingCard';
import FollowersCard from '../components/profilePage/FollowerCard';
import { useMediaQuery } from 'react-responsive';
import { FollowProvider } from '../context/UserFansContext';
const Profile = () => {
  const isMobile = useMediaQuery({ maxWidth: 779 });
  const isTablet = useMediaQuery({ minWidth: 780, maxWidth: 1194 });
  const isDesktop = useMediaQuery({ minWidth: 1195 });
  return (
    <>
      <div className="min-h-[100vh] w-full ">
        
        <FollowProvider>
        <div className='pb-15'>
        <UserInfo />
        </div>
        </FollowProvider>

        <MyPlaylists />
      </div>
    </>
  );
};

export default Profile;
