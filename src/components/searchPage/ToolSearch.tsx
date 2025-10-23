import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FaMusic,
  FaUser,

  FaList,
} from 'react-icons/fa';

const ToolSearch = () => {
  const [params, setParams] = useSearchParams();
  const active = useMemo(() => params.get('cat') || 'All', [params]);

  useEffect(() => {
    if (!params.get('cat'))
      setParams(
        (p) => {
          const next = new URLSearchParams(p);
          next.set('cat', 'All');
          return next;
        },
        { replace: true }
      );
  }, [params, setParams]);

  const categories = [
    { name: 'All', icon: <FaList size={18} /> },
    { name: 'Songs', icon: <FaMusic size={18} /> },
    { name: 'Artists', icon: <FaUser size={18} /> },
    { name: 'Playlists', icon: <FaList size={18} /> },
  ];

  return (
    <div className="h-auto w-full px-6 py-3">
      <ul className="flex flex-wrap items-center justify-start gap-4 sm:gap-7">
        {categories.map(({ name, icon }) => (
          <li
            key={name}
            className={`flex cursor-pointer items-center gap-2 rounded-4xl px-5 py-2 text-white ${active === name ? 'bg-blue-600' : 'bg-gray-600'} transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-500`}
            onClick={() =>
              setParams((p) => {
                const next = new URLSearchParams(p);
                next.set('cat', name);
                return next;
              })
            }
            aria-selected={active === name}
          >
            {icon}
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToolSearch;
