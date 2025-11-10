// import { MusicSB } from '../components/music-sidebar/MusicSb';
import MyPlaylists from '../components/MyPlayLists/MyPlaylist';
import UserInfo from '../components/profilePage/UserInfo';
import { FollowProvider } from '../context/UserFansContext';

const Profile = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#101721]">
      <div className="sticky top-0 h-screen flex-shrink-0">
        {/* <MusicSB /> */}
      </div>
      <div className="flex-1 overflow-y-auto">
        <FollowProvider>
          <UserInfo />
        </FollowProvider>
        <MyPlaylists />
      </div>
    </div>
  );
};

export default Profile;
