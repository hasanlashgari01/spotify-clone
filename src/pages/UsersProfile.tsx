import OthersProfile from '../components/othersProfile/OthersProfile'
import { FollowProvider } from '../context/UserFansContext';

const UsersProfile = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#1574F5_0%,#1453AB_16%,#13458A_35%,#112745_55%,#101721_75%,#101721_100%)]">
      <FollowProvider>
        <OthersProfile/>
      </FollowProvider>
    </div>
  )
}

export default UsersProfile