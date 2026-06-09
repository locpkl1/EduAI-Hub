import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Brain,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  BookOpen,
  Library,
  User,
  ExternalLink,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    // Default to dark for the premium experience
    return true;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return [dark, () => setDark((d) => !d)] as const;
}

function getInitials(name: string) {
  return (
    name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?'
  );
}

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl: string }) {
  const [err, setErr] = useState(false);
  if (avatarUrl && !err) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setErr(true)}
        className="w-8 h-8 object-cover border-2"
        style={{ borderRadius: '6px', borderColor: 'var(--color-primary)' }}
      />
    );
  }
  return (
    <span
      className="w-8 h-8 flex items-center justify-center text-xs font-bold border-2"
      style={{
        borderRadius: '6px',
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        borderColor: 'var(--color-primary)',
      }}
    >
      {getInitials(name)}
    </span>
  );
}

const navItems = [
  { to: '/', label: 'Trang Chủ', exact: true },
  { to: '/guides', label: 'Hướng Dẫn', exact: false },
  { to: '/ai-tools', label: 'Công Cụ AI', exact: false },
  { to: '/lessons', label: 'Bài Học', exact: false },
];

export default function Layout() {
  const { signOut, signInWithGoogle, user, displayName, avatarUrl, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [dark, toggleDark] = useDarkMode();
  const userRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const showUser = Boolean(user) && !loading;
  const userLabel = displayName || user?.email?.split('@')[0] || 'Tài khoản';

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) setResourcesOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Navbar */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div
                className="w-8 h-7 flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ backgroundColor: 'var(--color-primary)', clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                <Brain size={16} color="#ffffff" />
              </div>
              <span
                className="font-display font-800 text-base hidden sm:block tracking-tight"
                style={{ color: 'var(--color-text)', letterSpacing: '-0.03em' }}
              >
                Edu<span style={{ color: 'var(--color-primary)' }}>-AI</span> Hub
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `nav-link text-sm font-medium ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {/* Tài Nguyên dropdown */}
              <div className="relative" ref={resourcesRef}>
                <button
                  type="button"
                  onClick={() => setResourcesOpen((p) => !p)}
                  className="nav-link text-sm font-medium flex items-center gap-1 cursor-pointer"
                >
                  Tài Nguyên
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{ transform: resourcesOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </button>
                {resourcesOpen && (
                  <div
                    className="absolute top-full left-0 mt-3 w-52 border shadow-card-hover z-50 overflow-hidden"
                    style={{
                      backgroundColor: 'var(--color-bg-card)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <NavLink
                      to="/prompts"
                      onClick={() => setResourcesOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
                      style={{ color: 'var(--color-text)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Library size={14} style={{ color: 'var(--color-primary)' }} />
                      Kho Prompt
                    </NavLink>
                    <div style={{ borderTop: '1px solid var(--color-border)' }} />
                    <NavLink
                      to="/textbooks"
                      onClick={() => setResourcesOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
                      style={{ color: 'var(--color-text)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <BookOpen size={14} style={{ color: 'var(--color-primary)' }} />
                      Sách Giáo Khoa
                    </NavLink>
                  </div>
                )}
              </div>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Dark mode toggle */}
              <button
                type="button"
                onClick={toggleDark}
                className="w-8 h-8 flex items-center justify-center transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label={dark ? 'Chế độ sáng' : 'Chế độ tối'}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* User */}
              {showUser ? (
                <div className="relative" ref={userRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((p) => !p)}
                    className="flex items-center gap-2 px-2 py-1.5 transition-colors"
                    style={{ color: 'var(--color-text)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <UserAvatar name={userLabel} avatarUrl={avatarUrl} />
                    <span className="text-sm font-medium hidden sm:block max-w-[120px] truncate">
                      {userLabel}
                    </span>
                    <ChevronDown size={13} style={{ color: 'var(--color-text-muted)' }} />
                  </button>
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 border shadow-card-hover z-50 overflow-hidden"
                      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
                    >
                      <button
                        type="button"
                        onClick={() => { setUserMenuOpen(false); navigate('/profile'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors text-left"
                        style={{ color: 'var(--color-text)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <User size={14} />
                        Thông Tin Cá Nhân
                      </button>
                      <div style={{ borderTop: '1px solid var(--color-border)' }} />
                      <button
                        type="button"
                        onClick={() => { setUserMenuOpen(false); signOut(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors text-left"
                        style={{ color: 'var(--color-text)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <LogOut size={14} />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : loading ? (
                <div className="w-8 h-8 bg-bg-muted animate-pulse" style={{ borderRadius: '6px' }} />
              ) : (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="btn-primary hidden sm:flex items-center gap-2 text-sm"
                >
                  <GoogleIcon />
                  Đăng nhập
                </button>
              )}

              {/* Mobile menu */}
              <button
                type="button"
                onClick={() => setMobileOpen((p) => !p)}
                className="md:hidden w-8 h-8 flex items-center justify-center transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t"
            style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
          >
            <nav className="px-4 py-3 space-y-0.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'text-primary' : ''
                    }`
                  }
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {item.label}
                </NavLink>
              ))}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '8px' }}>
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-light)' }}>
                  Tài Nguyên
                </p>
                <NavLink
                  to="/prompts"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <Library size={14} />
                  Kho Prompt
                </NavLink>
                <NavLink
                  to="/textbooks"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <BookOpen size={14} />
                  Sách Giáo Khoa
                </NavLink>
              </div>

              {showUser && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <User size={14} />
                    Thông Tin Cá Nhân
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); signOut(); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <LogOut size={14} />
                    Đăng xuất
                  </button>
                </div>
              )}

              {!showUser && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); signInWithGoogle(); }}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                  >
                    <GoogleIcon />
                    Đăng nhập bằng Google
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="mt-20 border-t py-8"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-6 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-primary)', clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))' }}
                >
                  <Brain size={13} color="#ffffff" />
                </div>
                <span className="font-display font-bold text-sm tracking-tight" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                  Edu-AI Hub
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                Giúp học sinh Việt Nam học thông minh hơn cùng AI
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs" style={{ color: 'var(--color-text-light)' }}>Thực hành trên:</span>
              <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                ChatGPT <ExternalLink size={10} />
              </a>
              <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                Gemini <ExternalLink size={10} />
              </a>
              <a href="https://claude.ai" target="_blank" rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                Claude <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export { useDarkMode };
