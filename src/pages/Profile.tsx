import MyPlaylists from '../components/MyPlayLists/MyPlaylist';
import UserInfo from '../components/profilePage/UserInfo';
import { FollowProvider } from '../context/UserFansContext';

const Profile = () => {
  return (
    <>
      <div className="min-h-[100vh] w-full">
        <FollowProvider>
          <div className="pb-15">
            <UserInfo />
          </div>
        </FollowProvider>

        <MyPlaylists />
      </div>
    </>
  );
};

export default Profile;
