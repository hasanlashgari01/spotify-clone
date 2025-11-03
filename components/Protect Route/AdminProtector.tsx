// import { useEffect, useState } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { getMe } from '../../services/meService';
// import LuxeLoader from '../../components/loading/LuxeLoader';

// interface ProtectedRouteProps {
//   children: JSX.Element;
// }

// export function AdminProtector({ children }: ProtectedRouteProps) {
//   const [loading, setLoading] = useState(true);
//   const [allowed, setAllowed] = useState<boolean | null>(null);
//   const location = useLocation();

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const me = await getMe();
//         const role = (me?.role || '').toLowerCase();
//         const isAdmin = role === 'admin';
//         const notBanned = me?.isBan === false;
//         if (mounted) setAllowed(isAdmin && notBanned);
//       } catch (e) {
//         console.error(e);
//         if (mounted) setAllowed(false);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   if (loading)
//     return (
//       <div className="min-h-[50vh] flex items-center justify-center">
//         <LuxeLoader />
//       </div>
//     );

//   if (!allowed) {
//     return (
//       <Navigate
//         to="/"
//         replace
//         state={{ from: location, message: 'دسترسی ادمین لازم است.' }}
//       />
//     );
//   }

//   return children;
// }


import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LuxeLoader from '../../components/loading/LuxeLoader';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function AdminProtector({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(false); // بعد از لود شدن اطلاعات به صورت پیش‌فرض بارگذاری تمام می‌شود
  }, []);

  if (loading)
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LuxeLoader />
      </div>
    );

  return children;
}
