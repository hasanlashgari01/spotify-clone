import MyPlaylists from '../components/MyPlayLists/MyPlaylist';
import UserInfo from '../components/profilePage/UserInfo';
import FollowingCard from '../components/profilePage/FollowingCard';
import FollowersCard from '../components/profilePage/FollowerCard';
import { useMediaQuery } from 'react-responsive';
const Profile = () => {
  const isMobile = useMediaQuery({maxWidth : 779})
  const isTablet = useMediaQuery({minWidth : 780 , maxWidth: 1194 });
  const isDesktop = useMediaQuery({ minWidth: 1195 });
  return (
    <>
      <div className="min-h-[100vh] w-full bg-[#101721]">
        <UserInfo />
        {isDesktop && <><FollowingCard /> <FollowersCard/></>}
        {isTablet && (
          <div className="flex justify-center p-8">
            <div className="h-55 w-[80vw] flex justify-between  rounded-4xl border-2 border-blue-700">
              <FollowingCard></FollowingCard>
              <FollowersCard></FollowersCard>
            </div>
          </div>
        )}
        {isMobile && 
        <>
        <div className="flex justify-center p-8">
            <div className="h-55 w-[80vw] flex justify-center  rounded-4xl border-2 border-blue-700">
              <FollowingCard></FollowingCard>
              
            </div>
          </div>
        <div className="flex justify-center p-8">
            <div className="h-55 w-[80vw] flex justify-center  rounded-4xl border-2 border-blue-700">
              
              <FollowersCard></FollowersCard>
            </div>
          </div>
        </>}
        <MyPlaylists />
      </div>
    </>
  );
};

export default Profile;
