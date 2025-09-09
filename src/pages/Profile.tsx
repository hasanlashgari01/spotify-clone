import MyPlaylists from '../components/MyPlayLists/MyPlaylist';
import UserInfo from '../components/profilePage/UserInfo';
const Profile = () => {
  return (
    <>
      <div className='bg-[#101721] w-full h-[100vh]'>
        <UserInfo/>
        <MyPlaylists />
        
      </div>
    </>
  );
};

export default Profile;
