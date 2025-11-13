import MyPlaylists from '../components/MyPlayLists/MyPlaylist';
import UserInfo from '../components/profilePage/UserInfo';
import { FollowProvider } from '../context/UserFansContext';

const Profile = () => {
  return (

<>
  <FollowProvider>
    <UserInfo />
  </FollowProvider>
  <MyPlaylists />
</>




  );
};

export default Profile;
