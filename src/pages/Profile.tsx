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
        <UserInfo />
        <FollowProvider>
          {isDesktop && (
          <>
            <div className="flex justify-center p-8">
            <div className="flex h-70 w-[80vw] justify-around items-center rounded-4xl border-2 border-blue-700">
              <FollowingCard></FollowingCard>
              <FollowersCard></FollowersCard>
            </div>
          </div>
          </>
        )}
        {isTablet && (
          <div className="flex justify-center p-8">
            <div className="flex h-55 w-[80vw] justify-between rounded-4xl border-2 border-blue-700">
              <FollowingCard></FollowingCard>
              <FollowersCard></FollowersCard>
            </div>
          </div>
        )}
        {isMobile && (
          <>
            <div className="flex justify-center p-8">
              <div className="flex h-55 w-[80vw] justify-center rounded-4xl border-2 border-blue-700">
                <FollowingCard></FollowingCard>
              </div>
            </div>
            <div className="flex justify-center p-8">
              <div className="flex h-55 w-[80vw] justify-center rounded-4xl border-2 border-blue-700">
                <FollowersCard></FollowersCard>
              </div>
            </div>
          </>
        )}
        </FollowProvider>

        <MyPlaylists />
      </div>
    </>
  );
};

export default Profile;
