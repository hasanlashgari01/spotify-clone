import React from 'react';
import defAvatar from '../../../public/default-avatar.webp';
import { Link } from 'react-router-dom';
interface FollowingProps {
  avatar: string;
  fullName: string;
  
}

const FollowingSection: React.FC<FollowingProps> = ({
  avatar,
  fullName,
  
}) => {
  return (
    <div className="relative flex flex-col items-center p-2">
      <Link to={`/profile/${fullName}`}>
      <img
        src={avatar ? avatar : defAvatar}
        alt={fullName}
        className="h-20 w-20 rounded-full border-2 border-blue-600 object-cover"
      />
      <h3 className="max-w-[80px] text-center text-lg font-semibold text-white">
        {fullName}
      </h3>
      </Link>
      
    </div>
  );
};

export default FollowingSection;
