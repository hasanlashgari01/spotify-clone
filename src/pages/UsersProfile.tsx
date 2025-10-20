import OthersProfile from '../components/othersProfile/OthersProfile'
import { FollowProvider } from '../context/UserFansContext';

const UsersProfile = () => {
  return (
    <div className="min-h-screen w-full">
      <FollowProvider>
        <OthersProfile/>
      </FollowProvider>
    </div>
  )
}

export default UsersProfile