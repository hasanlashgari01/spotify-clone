import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/meService";
import { Followers, Followings, getFollowingCount, getUserFollowings } from "../services/userDetailsService";

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
  meId: number;
  setMeId: React.Dispatch<React.SetStateAction<number>>;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [followings, setFollowings] = useState<Followings[]>([]);
  const [followers, setFollowers] = useState<Followers[]>([]);
  const [meId, setMeId] = useState<number>(0);
  const [count , setCount] = useState<Count>({
    followers: 0,
    followings: 0,
  });
  const fetchData = async () => {
    try {
      const me = await getMe();
      if (!me) return;
      setMeId(me.sub);
      const followersCount = await getFollowingCount(`${me.sub}`, `followers`);
      const followingsCount = await getFollowingCount(`${me.sub}`, `followings`);
      const followings = await getUserFollowings(`${me.sub}`, 1, 1000000);
      setCount({
        followers: Number(followersCount) || 0,
        followings: Number(followingsCount) || 0,
      });
      setFollowings(followings?.followings ?? [])
    } catch (e) {
      console.log('Error occurred:', e);
      setCount({ followers: 0, followings: 0 });
    }
  }
  useEffect(() => {
    fetchData();
  }, [])
  
  return (
    <FollowContext.Provider value={{ followings, setFollowings, followers, setFollowers , count , setCount, meId, setMeId}}>
      {children}
    </FollowContext.Provider>
  );
};


export const useFollow = () => {
  const context = useContext(FollowContext);
  if (!context) throw new Error("useFollow must be used within FollowProvider");
  return context;
};
