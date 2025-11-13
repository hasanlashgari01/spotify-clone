import Info from '../components/layout/info/Info.tsx'
import { FollowProvider } from '../context/UserFansContext';
import { useEffect, useState } from 'react';
import { getMe } from '../services/meService.ts';
import { useNavigate } from 'react-router-dom';


const UsersProfile = () => {
  const [, setBio] = useState('');
  const [, setPicture] = useState('');
  const [, setName] = useState('');
  const navigate = useNavigate();
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) return;
    const testme = async () => {
      const res = await getMe();
      if (res.sub === id) {
        navigate("/profile");

      }

    }



    testme()

  }, [id, loading, navigate]);
  return (
    <div className="min-h-screen w-full">
      <FollowProvider>
        <Info
          setBio={setBio}
          setPicture={setPicture}
          setName={setName}
          setId={setId}
          setLoading={setLoading}
          isArtist={false}
        />
      </FollowProvider>
    </div>
  );
}

export default UsersProfile