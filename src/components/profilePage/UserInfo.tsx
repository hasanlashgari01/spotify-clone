import { authService, User } from '../../services/authService';
import { useEffect, useCallback, useState, useRef } from 'react';
import defAvatar from '../../../public/default-avatar.webp';
import LoadingCircle from '../loading/LoadingCircle';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/userinfo.css';
import { useFollow } from '../../context/UserFansContext';
import FollowersCard from './FollowerCard';
import FollowingCard from './FollowingCard';
import { playlistService } from '../../services/playlistService';

const MAX_FILE_SIZE = 1024 * 1024;

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
  const { count } = useFollow();
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
  const [PlaylCount, setPlaylCount] = useState<number>(0);
  const [UserId, setUserId] = useState<string>('');
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const fetchUserData = useCallback(async () => {
    try {
      const data = await authService.getUser();
      const res = await playlistService.getMyPlaylists();
      setPlaylCount(res.playlists.length);
      setUserId(data?.id ? data?.id : '');
      setFullName(data?.fullName || '');
      setBio(data?.bio || 'bio must be placed here');
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
        fetchUserData();
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    },
    [userData, bio, gender, userImage, fetchUserData]
  );

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
  }, [sizeErr, fullName, userData?.fullName, handlePictureChange]);
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
    if (inputValue.trim() !== '') {
      return inputValue;
    }
    if (typeof userValue === 'string' && userValue.trim() !== '') {
      return userValue;
    }
    return fallback;
  };




  useEffect(() => {
    if (!modalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [modalOpen]);

  return (
    <div className="relative z-50 flex h-[220px] flex-col items-start justify-end overflow-hidden rounded-b-2xl bg-cover bg-center sm:h-[300px] md:h-[340px] lg:h-[390px]">
      <div className="pointer-events-none absolute inset-0 flex flex-row bg-[linear-gradient(135deg,#1a2c5b_0%,#0f1f3d_30%,#0a1628_60%,#050b14_100%)]" />

      <div className="flex w-[100vw] items-start justify-between">
        <div className="">
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
                  className="relative mb-20 flex w-full max-w-[25rem] flex-col gap-4 rounded-2xl bg-gradient-to-b from-[#101721] to-[#101721e6] p-6 text-white shadow-2xl"
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
                        className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#1574f5] ring-2 ring-white/30 transition hover:bg-[#0b4fae]"
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
                          className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
                          onChange={handleFileInput}
                          tabIndex={-1}
                          style={{ cursor: 'pointer' }}
                        />
                      </label>
                    </div>
                    {sizeErr && (
                      <span className="mt-1 text-xs text-red-400">
                        File size must be under 1MB
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
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
                      className="resize-none rounded-xl border border-white/10 bg-[#0b1017] p-2.5 text-white transition outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[#1574f5]"
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
                    <p className="mt-1 text-sm text-red-400">
                      Name cannot be empty
                    </p>
                  )}

                  <button
                    className={`mt-3 w-full rounded-xl bg-[#1574f5] p-2.5 font-semibold transition hover:bg-[#0b4fae] focus:ring-2 focus:ring-[#1574f5] ${
                      sizeErr ||
                      !getUpdateValue(
                        fullName,
                        userData?.fullName,
                        'Am1r'
                      ).trim()
                        ? 'cursor-not-allowed opacity-50'
                        : ''
                    }`}
                    onClick={handleUpdateClick}
                    disabled={
                      sizeErr ||
                      !getUpdateValue(
                        fullName,
                        userData?.fullName,
                        'Am1r'
                      ).trim() ||
                      loading
                    }
                    style={{
                      cursor:
                        sizeErr ||
                        !getUpdateValue(
                          fullName,
                          userData?.fullName,
                          'Am1r'
                        ).trim() ||
                        loading
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                  >
                    {loading ? <LoadingCircle /> : 'Save Changes'}
                  </button>
                  {successMsg && (
                    <div className="mt-2 text-center text-sm text-green-400">
                      {successMsg}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative flex min-w-full flex-col items-start px-4 pt-26 pb-6 backdrop-blur-[2px] sm:px-6 sm:pt-24 md:px-8 md:pt-28 lg:px-10 lg:pt-32">
            <div className="flex w-full flex-col items-center pb-4 sm:items-start sm:pb-5">
              <div className="flex flex-col items-center pb-3 sm:items-start sm:pb-5">
                <div className="group relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500/40 via-cyan-400/30 to-indigo-500/30 blur-lg" />

                  <img
                    className="relative h-28 w-28 rounded-full object-cover ring-2 ring-white/10 transition sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-44 lg:w-44"
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

            <div className="flex w-full flex-row items-center justify-center gap-2 pb-3 text-2xl text-white sm:justify-center sm:pb-6 sm:text-3xl md:text-4xl">
              <span className="font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] text-sm sm:text-md md:text-lg lg:text-2xl">
                {userData?.fullName ? userData.fullName : 'Name'}
              </span>
            </div>
          </div>
        </div>

        <div className="relative top-[30%] mr-1 flex h-fit flex-col items-center justify-center gap-5 rounded-2xl p-3 transition-all sm:top-[30%] sm:mr-20 sm:rounded-3xl sm:p-5 md:top-[20%] md:mr-15 md:p-10 lg:top-[10%] lg:mr-30 lg:p-13">
          <motion.div
            className="relative flex gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent p-4 shadow-xl backdrop-blur-xl sm:gap-6 sm:p-6 md:gap-10 md:p-8 lg:gap-12 lg:p-15"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5" />

            <motion.button
              type="button"
              onClick={() => setFollowersOpen(true)}
              className="group relative flex cursor-pointer flex-col items-center text-center transition-all outline-none focus:outline-none"
              aria-label="Open followers list"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.h2
                className="bg-gradient-to-br from-blue-400 to-cyan-300 bg-clip-text text-2xl leading-none font-black text-transparent sm:text-3xl md:text-5xl lg:text-6xl"
                animate={{
                  textShadow: [
                    '0 0 15px rgba(59,130,246,0.4)',
                    '0 0 25px rgba(59,130,246,0.7)',
                    '0 0 15px rgba(59,130,246,0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {count.followers}+
              </motion.h2>
              <h3 className="mt-1 text-xs font-medium text-gray-300 transition-colors group-hover:text-white sm:text-sm md:text-lg lg:text-xl">
                Followers
              </h3>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setFollowingsOpen(true)}
              className="group relative flex cursor-pointer flex-col items-center text-center transition-all outline-none focus:outline-none"
              aria-label="Open followings list"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.h2
                className="bg-gradient-to-br from-blue-400 to-cyan-300 bg-clip-text text-2xl leading-none font-black text-transparent sm:text-3xl md:text-5xl lg:text-6xl"
                animate={{
                  textShadow: [
                    '0 0 15px rgba(59,130,246,0.4)',
                    '0 0 25px rgba(59,130,246,0.7)',
                    '0 0 15px rgba(59,130,246,0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {count.followings}+
              </motion.h2>
              <h3 className="mt-1 text-xs font-medium text-gray-300 transition-colors group-hover:text-white sm:text-sm md:text-lg lg:text-xl">
                Following
              </h3>
            </motion.button>

            <motion.div
              className="group relative hidden flex-col items-center text-center transition-all sm:flex"
              whileHover={{ scale: 1.05 }}
            >
              <motion.h2
                className="bg-gradient-to-br from-blue-400 to-cyan-300 bg-clip-text text-2xl leading-none font-black text-transparent sm:text-3xl md:text-5xl lg:text-6xl"
                animate={{
                  textShadow: [
                    '0 0 15px rgba(59,130,246,0.4)',
                    '0 0 25px rgba(59,130,246,0.7)',
                    '0 0 15px rgba(59,130,246,0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {count.followings ? PlaylCount : 0}+
              </motion.h2>
              <h3 className="mt-1 text-xs font-medium text-gray-300 sm:text-sm md:text-lg lg:text-xl">
                Playlists
              </h3>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="fixed">
        <FollowersCard
          open={followersOpen}
          onClose={() => setFollowersOpen(false)}
          profileUserId={UserId}
        />
        <FollowingCard
          open={followingsOpen}
          onClose={() => setFollowingsOpen(false)}
        />
      </div>
    </div>
  );
};

export default UserInfo;
