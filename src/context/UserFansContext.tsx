
import React, { createContext, useContext, useEffect, useState } from "react";
import { Followings , Followers, getFollowingCount } from "../services/userDetailsService";
import { getMe } from "../services/meService";


interface Count {
  followers: number;
  followings: number;
}

interface FollowContextType {
  followings: Followings[];
  setFollowings: React.Dispatch<React.SetStateAction<Followings[]>>;
  followers: Followers[];
  setFollowers: React.Dispatch<React.SetStateAction<Followers[]>>;
  count: Count;
  setCount : React.Dispatch<React.SetStateAction<Count>>
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [followings, setFollowings] = useState<Followings[]>([]);
  const [followers, setFollowers] = useState<Followers[]>([]);
  const [count , setCount] = useState<Count>({
    followers: 0,
    followings: 0,
  });
  const fetchData = async () => {
    try {
      const me = await getMe();
      const followersCount = await getFollowingCount(`${me.sub}`, `followers`);
      const followingsCount = await getFollowingCount(`${me.sub}`, `followings`);
      setCount({
        followers: Number(followersCount) || 0,
        followings: Number(followingsCount) || 0,
      });
    } catch (e) {
      // keep defaults on error
      setCount({ followers: 0, followings: 0 });
    }
  }
  useEffect(() => {
    fetchData();
  }, [])
  
  return (
    <FollowContext.Provider value={{ followings, setFollowings, followers, setFollowers , count , setCount}}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => {
  const context = useContext(FollowContext);
  if (!context) throw new Error("useFollow must be used within FollowProvider");
  return context;
};
