import React from 'react';
import defAvatar from '../../../public/default-avatar.webp';
import { Link } from 'react-router-dom';
interface FollowerProps {
  avatar?: string;
  fullName: string;
}

const FollowerSection: React.FC<FollowerProps> = ({ avatar, fullName }) => {
  return (
    
      <tbody>
        <tr
          className="song-tableRow border-b border-gray-700 transition hover:bg-gray-800/40"
        >
          {/* Avatar */}
          <td className="w-16">
            <img
              src={avatar || defAvatar}
              className="h-12 w-12 rounded-lg object-cover"
              alt={fullName}
            />
          </td>

          {/* Full name */}
          <td>
            <div className="flex flex-col items-start justify-center">
              <Link to={`/profile/${fullName}`}><h3 className="text-base font-semibold text-white">
                {fullName}
              </h3></Link>
            </div>
          </td>
        </tr>
      </tbody>
    
  );
};

export default FollowerSection;
