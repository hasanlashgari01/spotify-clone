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
      className="relative flex h-[300px] flex-col items-start justify-end overflow-hidden rounded-b bg-cover bg-center z-1000 sm:h-[290px] md:h-[350px] lg:h-[400px]"
      style={{ backgroundImage: `url(${infoBG})` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />

      <AnimatePresence>
        {ModalStat && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => setModalStat(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="relative mb-20 flex w-full max-w-[24rem] flex-col gap-4 rounded-2xl p-5 text-white shadow-2xl sm:max-w-[26rem] sm:p-6 md:max-w-[28rem]"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -30, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.96, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 22,
                mass: 0.9,
              }}
              style={{
                background:
                  'linear-gradient(180deg, #101721 0%, rgba(16,23,33,0.95) 100%)',
              }}
            >
              <h2 className="text-center text-lg font-extrabold tracking-tight sm:text-xl">
                Edit Profile
              </h2>

              <label htmlFor="yourname" className="text-sm text-white/80">
                Enter your name <span className="text-red-500">*</span>
              </label>
              <input
                name="yourname"
                required
                value={fullName || ''}
                onChange={(e) => setfullName(e.target.value)}
                type="text"
                placeholder="Enter your name"
                className="rounded-xl border border-white/10 bg-[#0b1017] p-2.5 text-white transition outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[#1574f5]"
              />

              <label htmlFor="biobio" className="text-sm text-white/80">
                Enter your bio <span className="text-red-500">*</span>
              </label>
              <input
                name="biobio"
                value={bio || ''}
                onChange={(e) => setBio(e.target.value)}
                type="text"
                placeholder="Enter your bio"
                className="rounded-xl border border-white/10 bg-[#0b1017] p-2.5 text-white transition outline-none placeholder:text-white/40 focus:ring-2 focus:ring-[#1574f5]"
              />

              <label htmlFor="filesIn" className="text-sm text-white/80">
                Select Your Profile picture{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="filesIn"
                id="filesIn"
                accept="image/*"
                className="cursor-pointer rounded-xl border border-white/10 bg-[#0b1017] p-2 text-white transition file:mr-3 file:rounded-lg file:border-0 file:bg-[#0b4fae] file:px-3 file:py-1.5 file:text-white hover:file:bg-[#0b4fae]"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    setSizeErr(true);
                    setUserImage(null);
                    return;
                  }
                  const maxSize = 1 * 1024 * 1024;
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
                <label htmlFor="filesIn" className="text-sm text-red-400">
                  You should pick a File and File Size must be under 1MB
                </label>
              )}

              <label htmlFor="gender" className="text-sm text-white/80">
                Select your gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="cursor-pointer rounded-xl border border-white/10 bg-[#0b1017] p-2.5 text-white transition focus:ring-2 focus:ring-[#1574f5]"
              >
                <option value="male">male</option>
                <option value="female">female</option>
              </select>

              {fieldErr && (
                <p className="text-sm text-red-400">
                  Name and Bio cannot be empty
                </p>
              )}

              <button
                className={`mt-1 cursor-pointer rounded-xl bg-[#1574f5] p-2.5 font-semibold transition hover:bg-[#0b4fae] focus:ring-2 focus:ring-[#1574f5] sm:mt-2 ${
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

      <div className="relative z-10 flex min-w-full flex-col items-start rounded-3xl bg-black/30 px-4 pt-26 pb-6 backdrop-blur-[2px] sm:px-6 sm:pt-24 md:px-8 md:pt-28 lg:px-10 lg:pt-32">
        <div className="flex w-full flex-col items-center pb-4 sm:items-start sm:pb-5">
          <div className="flex flex-col items-center pb-3 sm:items-start sm:pb-5">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500/40 via-cyan-400/30 to-indigo-500/30 blur-lg" />
              <img
                className="relative h-28 w-28 rounded-full object-cover ring-2 ring-white/10 sm:h-40 sm:w-40 md:h-52 md:w-52 lg:h-60 lg:w-60"
                src={UserData?.avatar ? UserData.avatar : defAvatar}
                alt=""
              />

              <button
                type="button"
                className="absolute right-1 bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/70 ring-1 ring-white/20 transition hover:bg-black/80 sm:right-2 sm:bottom-2"
                onClick={() => {
                  setModalStat(true);
                }}
                aria-label="Edit avatar"
                title="Edit avatar"
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
              </button>
            </div>
          </div>
        </div>

        <div className="w-full pb-3 text-center text-2xl text-white sm:pb-6 sm:text-left sm:text-3xl md:text-4xl">
          Welcome dear:{' '}
          <span className="font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
            {UserData?.fullName ? UserData?.fullName : 'Choose A name'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
