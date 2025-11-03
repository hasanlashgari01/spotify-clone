import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Music, BarChart3, Settings, LogOut, User, Shield } from 'lucide-react';
import { getMe, MeResponse } from '../../services/meService';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [adminInfo, setAdminInfo] = useState<MeResponse | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setAdminInfo(me);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users, end: false },
    { to: '/admin/playlists', label: 'Playlists', icon: Music, end: false },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, end: false },
    { to: '/admin/settings', label: 'Settings', icon: Settings, end: false },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] bg-[#0b1220] text-white">
      <aside className="border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#0a1018]">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold">Admin Panel</div>
              <div className="text-xs text-white/50">Administrator Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-r-2 border-blue-500'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          {adminInfo && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{adminInfo.email}</div>
                <div className="text-xs text-white/50 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>{adminInfo.role === 'admin' ? 'Admin' : adminInfo.role}</span>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all border border-transparent hover:border-red-500/30"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <section className="overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default AdminLayout;


