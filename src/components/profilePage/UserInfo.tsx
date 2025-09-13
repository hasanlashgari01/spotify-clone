import React from 'react';
import { authService, User } from '../../services/authService';
import { useEffect, useState } from 'react';
import infoBG from '../../../public/Profile/info-bg.png';
import defAvatar from '../../../public/default-avatar.webp';
import LoadingCircle from '../loading/LoadingCircle';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/userinfo.css';

const UserInfo = () => {
  type Gender = 'male' | 'female' | 'other';
  const [UserData, setUserData] = useState<User | null>(null);
  const [UserImage, setUserImage] = useState<File | null>(null);
  
  const [ModalStat, setModalStat] = useState(false);
  const [fullName, setfullName] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>('male');
  const [Loading, setLoading] = useState<Boolean>(false);
  const [sizeErr, setSizeErr] = useState(false);
  const [fieldErr, setFieldErr] = useState(false);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await authService.getUser();
        setfullName(data ? data.fullName : null);
        setBio(data?.bio ? data.bio : null);
        setUserData(data);
        
        
      } catch (error) {
        console.log('Error occured :', error);
      }
    };

    fetchData();
  }, [Loading]);

  const handlePictureChange = async () => {
    if (!UserData) return;

    try {
      const updates = new FormData();
      updates.append('fullName', `${fullName}`);
      updates.append('bio', `${bio}`);

      if (UserImage) {
        updates.append('avatar', UserImage);
      }
      console.log(gender);
      updates.append('gender', `${gender}`);
      setLoading(true);
      const result = await authService.updateUser(updates);

      console.log('Updated user:', result);
    } catch (error) {
      console.log('Error Occured:', error);
    } finally {
      setModalStat(false);
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-200 flex-col items-start justify-end  bg-cover"
      style={{ backgroundImage: `url(${infoBG})` }}
    >
      <AnimatePresence>
        {ModalStat && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setModalStat(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative flex w-96 flex-col gap-4 rounded-2xl bg-gray-800 p-6 text-white"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -50, scale: 0.8, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.8, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                mass: 1,
              }}
            >
              <h2 className="text-center text-xl font-bold">Edit Profile</h2>
              <label htmlFor="yourname">Enter your name <span className='text-red-600'>*</span> </label>
              <input
                name='yourname'
                required
                value={fullName || ''}
                onChange={(e) => setfullName(e.target.value)}
                type="text"
                placeholder="Enter your name"
                className="rounded-xl border border-gray-600 bg-gray-700 p-2 text-white outline-none"
              />
              <label htmlFor="biobio">Enter your bio <span className='text-red-600'>*</span> </label>
              <input
              name='biobio'
                value={bio || ''}
                onChange={(e) => setBio(e.target.value)}
                type="text"
                placeholder="Enter your bio"
                className="rounded-xl border border-gray-600 bg-gray-700 p-2 text-white outline-none"
              />
              <label htmlFor="fileIn">Select Your Profile picture <span className='text-red-600'>*</span> </label>
              <input
                type="file"
                name="filesIn"
                id="filesIn"
                accept="image/*"
                className="cursor-pointer rounded-xl border border-gray-600 bg-gray-700 p-2 text-white"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    setSizeErr(true);
                    setUserImage(null);
                    return;
                  }
                  const maxSize = 1 * 1024 * 1024; // 1MB
                  if (file.size > maxSize) {
                    setSizeErr(true);
                    setUserImage(null);
                  } else {
                    setSizeErr(false);
                    setUserImage(file);
                  }
                }}
              />
              {sizeErr && (
                <label htmlFor="filesIn" className="text-red-700">
                  You should pick a File and File Size must be under 1MB
                </label>
              )}
              <label htmlFor="gender">Select your gender<span className='text-red-600'>*</span> </label>
              <select
              name='gender'
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="cursor-pointer rounded-xl border border-gray-600 bg-gray-700 p-2 text-white"
              >
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="other">other</option>
              </select>

              {fieldErr && (
                <p className="text-sm text-red-700">
                  Name and Bio cannot be empty
                </p>
              )}

              <button
                className={`mt-2 cursor-pointer rounded-xl bg-green-600 p-2 font-bold hover:bg-green-700 ${
                  sizeErr || !fullName || !bio
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
                onClick={() => {
                  if (!fullName || !bio || sizeErr) return;
                  setFieldErr(false);
                  handlePictureChange();
                }}
                disabled={sizeErr || !fullName || !bio}
              >
                {Loading ? <LoadingCircle /> : 'Update Info'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-[100%] flex-col items-start rounded-3xl bg-black/18 pt-30 pl-10">
        <div className="w-content flex flex-col items-start pb-5">
          <div className="flex flex-col items-center pb-5">
            <img
              className="h-60 w-60 rounded-[50%]"
              src={UserData?.avatar ? UserData.avatar : defAvatar}
              alt=""
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="cameraICO -mt-4 h-6 w-6 cursor-pointer text-white"
              viewBox="0 0 16 16"
              onClick={() => {
                setModalStat(true);
              }}
            >
              <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
              <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
            </svg>
          </div>
        </div>
        <div className="text-3xl text-white pb-10">
          Welcome dear :{' '}
          <span className="text-3xl font-bold text-white">
            {UserData?.fullName ? UserData?.fullName : 'Choose A name'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
