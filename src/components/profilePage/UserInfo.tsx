import { authService, User } from '../../services/authService';
import { useEffect, useCallback, useState, useRef } from 'react';
import defAvatar from '../../../public/default-avatar.webp';
import LoadingCircle from '../loading/LoadingCircle';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/userinfo.css';
import { useFollow } from '../../context/UserFansContext';
import FollowersCard from './FollowerCard';
import FollowingCard from './FollowingCard';

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Prefer not to say' },
];

const UserInfo = () => {
  type Gender = 'male' | 'female' | 'other';

  const [userData, setUserData] = useState<User | null>(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {count} = useFollow();
  const [modalOpen, setModalOpen] = useState(false);
  const [fullName, setFullName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [gender, setGender] = useState<Gender>('male');
  const [loading, setLoading] = useState(false);
  const [sizeErr, setSizeErr] = useState(false);
  const [fieldErr, setFieldErr] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingsOpen, setFollowingsOpen] = useState(false);

  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const fetchUserData = useCallback(async () => {
    try {
      const data = await authService.getUser();
      setFullName(data?.fullName || '');
      setBio(data?.bio || '');
      setUserData(data);
      setGender(
        data?.gender === 'male' ||
        data?.gender === 'female' ||
        data?.gender === 'other'
          ? (data.gender as Gender)
          : 'male'
      );
      setPreviewImage(data?.avatar || null);
    } catch (error) {
      console.log('Error occurred:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!loading) fetchUserData();
  }, [loading]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        setSizeErr(true);
        setUserImage(null);
        setPreviewImage(userData?.avatar || null);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setSizeErr(true);
        setUserImage(null);
        setPreviewImage(userData?.avatar || null);
      } else {
        setSizeErr(false);
        setUserImage(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    },
    [userData]
  );

  const getUpdateValue = (
    inputValue: string,
    userValue: string | undefined,
    fallback: string = ''
  ) => {
    if (typeof inputValue === 'string' && inputValue.trim() !== '') {
      return inputValue;
    }
    if (typeof userValue === 'string' && userValue.trim() !== '') {
      return userValue;
    }
    return fallback;
  };

  const handleUpdateClick = useCallback(() => {
    if (sizeErr) {
      setFieldErr(true);
      return;
    }
    const nameToSend = getUpdateValue(fullName, userData?.fullName, 'Am1r');
    if (!nameToSend.trim()) {
      setFieldErr(true);
      return;
    }
    setFieldErr(false);
    handlePictureChange(nameToSend);
  }, [fullName, bio, sizeErr, userImage, gender, userData]);

  const handlePictureChange = useCallback(
    async (nameToSend: string) => {
      if (!userData) return;
      setLoading(true);
      setSuccessMsg('');
      try {
        const updates = new FormData();
        updates.append('fullName', nameToSend);
        const bioToSend = getUpdateValue(bio, userData?.bio, '');
        updates.append('bio', bioToSend);
        updates.append('gender', gender);
        if (userImage) {
          updates.append('avatar', userImage);
        }
        await authService.updateUser(updates);
        setSuccessMsg('Profile updated successfully!');
      } catch (error) {
        console.log('Error Occurred:', error);
      } finally {
        setModalOpen(false);
        setLoading(false);
        setUserImage(null);
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    },
    [userData, fullName, bio, userImage, gender]
  );

  useEffect(() => {
    if (!modalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [modalOpen]);

  return (
    <div className="relative border-b-1 border-gray-300 z-1000 flex h-[220px] flex-col items-start justify-end overflow-hidden rounded-b bg-cover bg-center sm:h-[300px] md:h-[340px] lg:h-[390px]">
      <div className="pointer-events-none  absolute inset-0 bg-[linear-gradient(180deg,#0b2e5a_0%,#0c2d4e_20%,#101d38_50%,#101721_100%)] flex flex-row" />

      <div className='flex w-[100vw] items-between justify-between '>
      <div className=''>
        <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            aria-modal="true"
            role="dialog"
            style={{ cursor: 'pointer' }}
          >
            <motion.div
              className="relative mb-20 flex w-full max-w-[25rem] flex-col gap-4 rounded-2xl p-6 text-white shadow-2xl bg-gradient-to-b from-[#101721] to-[#101721e6]"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -40, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.95, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 24,
                mass: 1.1,
                duration: 0.35,
              }}
              style={{ cursor: 'default' }}
            >
              <h2 className="text-center text-xl font-extrabold tracking-tight">
                Edit Profile
              </h2>

              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <img
                    className="h-24 w-24 rounded-full object-cover ring-2 ring-[#1574f5]/30"
                    src={previewImage || defAvatar}
                    alt="Profile Preview"
                  />
                  <label
                    htmlFor="filesIn"
                    className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#1574f5] ring-2 ring-white/30 hover:bg-[#0b4fae] transition"
                    title="Change avatar"
                    style={{ cursor: 'pointer' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="text-white"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                      <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
                    </svg>
                    <input
                      type="file"
                      name="filesIn"
                      id="filesIn"
                      accept="image/*"
                      className="absolute left-0 top-0 h-full w-full opacity-0 cursor-pointer"
                      onChange={handleFileInput}
                      tabIndex={-1}
                      style={{ cursor: 'pointer' }}
                    />
                  </label>
                </div>
                {sizeErr && (
                  <span className="text-xs text-red-400 mt-1">
                    File size must be under 1MB
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label htmlFor="yourname" className="text-sm text-white/80">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="yourname"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  placeholder="Enter your name"
                  className="rounded-xl border border-white/10 bg-[#0b1017] p-2.5 text-white transition outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[#1574f5]"
                  maxLength={32}
                  autoFocus
                />

                <label htmlFor="biobio" className="text-sm text-white/80">
                  Bio
                </label>
                <textarea
                  name="biobio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  className="rounded-xl border border-white/10 bg-[#0b1017] p-2.5 text-white transition outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[#1574f5] resize-none"
                  rows={2}
                  maxLength={80}
                />

                <label htmlFor="gender" className="text-sm text-white/80">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="cursor-pointer rounded-xl border border-white/10 bg-[#0b1017] p-2.5 text-white transition focus:ring-2 focus:ring-[#1574f5]"
                  style={{ cursor: 'pointer' }}
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {fieldErr && (
                <p className="text-sm text-red-400 mt-1">
                  Name cannot be empty
                </p>
              )}

              <button
                className={`mt-3 w-full rounded-xl bg-[#1574f5] p-2.5 font-semibold transition hover:bg-[#0b4fae] focus:ring-2 focus:ring-[#1574f5] ${
                  sizeErr ||
                  !getUpdateValue(fullName, userData?.fullName, 'Am1r').trim()
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
                onClick={handleUpdateClick}
                disabled={
                  sizeErr ||
                  !getUpdateValue(fullName, userData?.fullName, 'Am1r').trim() ||
                  loading
                }
                style={{ cursor: sizeErr || !getUpdateValue(fullName, userData?.fullName, 'Am1r').trim() || loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? <LoadingCircle /> : 'Save Changes'}
              </button>
              {successMsg && (
                <div className="mt-2 text-center text-green-400 text-sm">
                  {successMsg}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex min-w-full flex-col items-start  px-4 pt-26 pb-6 backdrop-blur-[2px] sm:px-6 sm:pt-24 md:px-8 md:pt-28 lg:px-10 lg:pt-32">
        <div className="flex w-full flex-col items-center pb-4 sm:items-start sm:pb-5">
          <div className="flex flex-col items-center pb-3 sm:items-start sm:pb-5">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500/40 via-cyan-400/30 to-indigo-500/30 blur-lg" />
              <img
                className="relative h-28 w-28 rounded-full object-cover ring-2 ring-white/10 sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-44 lg:w-44 transition"
                src={userData?.avatar || defAvatar}
                alt="User avatar"
              />
              <button
                type="button"
                className="absolute right-1 bottom-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#1574f5] ring-2 ring-white/30 transition hover:bg-[#0b4fae] sm:right-2 sm:bottom-2"
                onClick={() => setModalOpen(true)}
                aria-label="Edit profile"
                title="Edit profile"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="text-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full pb-3 flex flex-row items-center justify-center sm:justify-start text-2xl text-white sm:pb-6 sm:text-3xl md:text-4xl gap-2">
          
          <span className="font-extrabold ml-3 sm:ml-7 md:ml-8 lg:ml-10 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
            {userData?.fullName ? userData.fullName : 'Am1r'}
          </span>
        </div>
      </div>
        
      
      </div>
      <div className='relative z-10 h-fit top-[42%] text-white  flex gap-8 md:gap-20 transition-all  items-center justify-center mr-10 lg:mr-20'>
        <button
          type='button'
          onClick={() => setFollowersOpen(true)}
          className='group flex flex-col text-center cursor-pointer select-none focus:outline-none'
          aria-label='Open followers list'
        >
          <h2 className='text-white transition-all group-hover:text-gray-300 text-[22px] sm:text-[30px] md:text-[35px] lg:text-[40px] z-1000'>{count.followers}+</h2>
          <h3 className='text-sm transition-all group-hover:text-gray-300  sm:text-xl md:text-2xl lg:text-3xl'>Followers</h3>
        </button>
        <button
          type='button'
          onClick={() => setFollowingsOpen(true)}
          className='group flex flex-col text-center cursor-pointer select-none focus:outline-none'
          aria-label='Open followings list'
        >
          <h2 className='text-white transition-all group-hover:text-gray-300 text-[22px] sm:text-[30px] md:text-[35px] lg:text-[40px] z-1000'>{count.followings}+</h2>
          <h3 className='text-sm transition-all group-hover:text-gray-300  sm:text-xl md:text-2xl lg:text-3xl'>Following</h3>
        </button>
      </div>
      
      </div>
      <div className='fixed'>
      <FollowersCard open={followersOpen} onClose={() => setFollowersOpen(false)} />
      <FollowingCard open={followingsOpen} onClose={() => setFollowingsOpen(false)} />
      </div>
    </div>
  );
};

export default UserInfo;
