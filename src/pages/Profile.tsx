import MyPlaylists from '../components/MyPlayLists/MyPlaylist';
import UserInfo from '../components/profilePage/UserInfo';
import { FollowProvider } from '../context/UserFansContext';

const Profile = () => {
  return (
    <>
      <div className="min-h-[100vh] w-full bg-[#101721]">
        <FollowProvider>
          <UserInfo />
        </FollowProvider>
        <MyPlaylists />
      </div>
    </>
  );
};

export default Profile;
