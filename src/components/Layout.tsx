import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Sparkles, BookOpen, Library, HelpCircle, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Trang chủ' },
  { to: '/prompt-creator', icon: Sparkles, label: 'Tạo Prompt' },
  { to: '/textbooks', icon: BookOpen, label: 'Sách giáo khoa' },
  { to: '/prompts', icon: Library, label: 'Kho Prompt' },
  { to: '/guides', icon: HelpCircle, label: 'Hướng dẫn' },
];

function getInitials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

function UserAvatar({ name, avatarUrl, size = 'md' }: { name: string; avatarUrl: string; size?: 'sm' | 'md' }) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm';
  const showImage = Boolean(avatarUrl) && !imgError;

  if (showImage) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className={`${sizeClass} rounded-full object-cover border-2 border-gray-200 bg-gray-100`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} rounded-full bg-blue-900 text-white font-semibold flex items-center justify-center border-2 border-blue-800`}
    >
      {getInitials(name)}
    </span>
  );
}

function UserNavBadge({ name, avatarUrl, compact = false }: { name: string; avatarUrl: string; compact?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 min-w-0 ${compact ? '' : 'max-w-[200px]'}`}
      title={name}
    >
      <UserAvatar name={name} avatarUrl={avatarUrl} size={compact ? 'sm' : 'md'} />
      {!compact && (
        <span className="text-sm font-medium text-gray-800 truncate hidden sm:block">{name}</span>
      )}
    </div>
  );
}

export default function Layout() {
  const { signOut, signInWithGoogle, user, displayName, avatarUrl, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const showUser = Boolean(user) && !loading;
  const userLabel = displayName || user?.email?.split('@')[0] || 'Tài khoản';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-lg hidden sm:block">EduAI-Hub</span>
            </NavLink>

            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center mx-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {showUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    type="button"
                    className="rounded-xl px-2 py-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <UserNavBadge name={userLabel} avatarUrl={avatarUrl} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-sm p-2 z-50">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        type="button"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : loading && user ? (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
                  <div className="hidden sm:block w-24 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg font-medium text-sm hover:bg-blue-800 transition-colors"
                  type="button"
                >
                  <span>Đăng nhập bằng Google</span>
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
                aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
              {showUser && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 mt-2">
                  <UserNavBadge name={userLabel} avatarUrl={avatarUrl} compact />
                  <span className="text-sm font-medium text-gray-800 truncate flex-1">{userLabel}</span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                    type="button"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
