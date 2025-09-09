import React from 'react';
import { authService, User  } from '../../services/authService';
import { useEffect, useState } from 'react';
import infoBG from '../../../public/Profile/info-bg.png';
import defAvatar from '../../../public/default-avatar.webp';
import '../../styles/userinfo.css';
const UserInfo = () => {
  type Gender = "male" | "female" | "others"
  const [UserData, setUserData] = useState<User | null>(null);
  const [UserImage, setUserImage] = useState<File | null>(null);
  const [ModalStat, setModalStat] = useState(false);
  const [fullName, setfullName] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>("male");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await authService.getUser();
        setfullName(data ? data.name : null);

        setUserData(data);
        
      } catch (error) {
        console.log('Error occured :', error);
      }
    };

    fetchData();
  }, []);

  const handlePictureChange = async () => {
    if (!UserData) return;

    const updates = new FormData();
    updates.append('fullName', `${fullName}`);
    updates.append('bio', `${bio}`);

    if (UserImage) {
      updates.append('avatar', UserImage);
    }
    updates.append('gender', `${gender}`);
    const result = await authService.updateUser(updates);
    console.log('Updated user:', result);
  };

  return (
    <div
      className="flex h-120 flex-col items-start justify-end pb-12 pl-12"
      style={{ backgroundImage: `url(${infoBG})` }}
    >
      {ModalStat && (
        <div className="fixed top-[30vh] left-[40vw] z-10 flex h-120 w-200 items-center justify-center rounded-2xl bg-gray-600 text-white">
          <div className="flex flex-col items-start justify-center gap-4">
            <label htmlFor="fullName" className="text-white">
              Enter your name :
            </label>
            <input
              value={fullName ? fullName : ''}
              onChange={(e) => {
                setfullName(e.target.value);
              }}
              type="text"
              name="fullName"
              id="fullName"
              className="h-10 w-90 rounded-xl border p-5 text-white outline"
              placeholder="Enter your name"
            />
            <label htmlFor="fullName" className="text-white">
              Enter your bio :
            </label>
            <input
              type="text"
              name="fullName"
              onChange={(e) => {
                setBio(e.target.value);
              }}
              value={bio ? bio : ''}
              id="fullName"
              className="h-10 w-90 rounded-xl border p-5 text-white outline"
              placeholder="Enter your bio"
            />
            <input
              type="file"
              name="pImage"
              id="pImage"
              className="h-10 w-90 cursor-pointer rounded-xl border bg-transparent pt-2 text-center text-white outline"
              onChange={async (e) => {
                try {
                  const file = e.target.files?.[0];
                  if (file) await setUserImage(file);
                } catch (error) {
                  console.log('Error Occured :', error);
                }
              }}
            />
            <select
              value={gender}
              onChange={(e : React.ChangeEvent<HTMLSelectElement>) => {
                setGender(e.target.value as Gender);
              }}
              className="h-10 w-90 cursor-pointer rounded-xl border p-2 text-white"
              name="genderSelector"
              id="genderSelector"
            >
              <option defaultChecked value="male">
                male
              </option>
              <option value="female">female</option>
              <option value="others">others</option>
            </select>
            <input
              type="button"
              value="Update Profile"
              className="h-10 w-90 cursor-pointer rounded-xl border text-white"
              onClick={ async () => {
                if ( !fullName || !bio || !gender) {

                  console.log("Something is missing" , fullName , bio , gender)
                  return;
                } else {
                  try {
                    const result = handlePictureChange()
                    console.log('Updated user:', result);
                  } catch (error) {}
                }
              }}
            />
          </div>
        </div>
      )}
      <div className='flex flex-col items-start'>
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
        <div className="text-3xl  text-white">
          Welcome dear : <span className='text-3xl font-bold text-white'>{UserData?.username ? UserData?.username : "You dont have any name" }</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
