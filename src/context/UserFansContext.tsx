
import React, { createContext, useContext, useState } from "react";
import { Followings , Followers } from "../services/userDetailsService";


interface FollowContextType {
  followings: Followings[];
  setFollowings: React.Dispatch<React.SetStateAction<Followings[]>>;
  followers: Followers[];
  setFollowers: React.Dispatch<React.SetStateAction<Followers[]>>;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [followings, setFollowings] = useState<Followings[]>([]);
  const [followers, setFollowers] = useState<Followers[]>([]);

  return (
    <FollowContext.Provider value={{ followings, setFollowings, followers, setFollowers }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => {
  const context = useContext(FollowContext);
  if (!context) throw new Error("useFollow must be used within FollowProvider");
  return context;
};
