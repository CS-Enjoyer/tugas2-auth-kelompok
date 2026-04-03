import React, { useContext, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from './context/AuthContext';
import BioGrid from './components/BioGrid';
import ThemeEditor from './components/ThemeEditor';
import './styles/GlobalStyles.css';

function App() {
  const { user, loginWithGoogle, logout, loading } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.theme) {
      const { primary_color, primary_bg, primary_text, font_family } = user.theme;
      if (primary_color) document.documentElement.style.setProperty('--primary-color', primary_color);
      if (primary_bg)    document.documentElement.style.setProperty('--primary-bg', primary_bg);
      if (primary_text)  document.documentElement.style.setProperty('--primary-text', primary_text);
      if (font_family)   document.documentElement.style.setProperty('--font-family', font_family);
    }
  }, [user]);

  const handleSuccess = async (credentialResponse) => {
    const success = await loginWithGoogle(credentialResponse.credential);
    if (!success) alert('Gagal memverifikasi login di server.');
  };

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner} />
        <p style={s.loadingText}>Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div style={s.app}>

      {/* ── Header ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.brand}>
            <div style={s.brandDot} />
            <span style={s.brandText}>Tugas PKPL — Kelompok</span>
          </div>

          {user && (
            <div style={s.userChip}>
              <div style={s.avatar}>
                {(user.name || user.email || '?')[0].toUpperCase()}
              </div>
              <span style={s.userName}>{user.name || user.email}</span>
              <button onClick={logout} style={s.logoutBtn}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main style={s.main}>

        {/* Login section */}
        {!user ? (
          <div style={s.loginWrap}>
            {/* Decorative blobs */}
            <div style={{ ...s.blob, top: '-60px', left: '-80px', background: 'rgba(76,175,80,0.12)' }} />
            <div style={{ ...s.blob, bottom: '-40px', right: '-60px', background: 'rgba(33,150,243,0.1)', width: '260px', height: '260px' }} />

            <div style={s.loginCard}>
              {/* Icon */}
              <div style={s.lockIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color,#4CAF50)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>

              <h2 style={s.loginTitle}>Silakan Login</h2>
              <p style={s.loginSub}>
                Masuk dengan akun Google untuk melihat biodata kelompok dan mengakses fitur lainnya.
              </p>

              <div style={s.divider} />

              <div style={s.googleWrap}>
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => console.log('Login Google Gagal')}
                  width="320"
                />
              </div>

              <p style={s.loginNote}>
                Akses terbatas hanya untuk anggota kelompok dan tamu terdaftar.
              </p>
            </div>
          </div>
        ) : (
          /* Status banner */
          <div style={user.is_member ? s.bannerAdmin : s.bannerGuest}>
            <div style={s.bannerDot(user.is_member)} />
            <div>
              <p style={s.bannerTitle}>
                {user.is_member ? 'Status: Admin' : 'Status: Tamu'}
              </p>
              <p style={s.bannerDesc}>
                {user.is_member
                  ? 'Anda memiliki akses penuh, termasuk editor tema website.'
                  : 'Anda dapat melihat biodata kelompok namun tidak dapat mengubah tema.'}
              </p>
            </div>
          </div>
        )}

        {/* Bio Grid */}
        <BioGrid />

        {/* Theme Editor (admin only) */}
        {user?.is_member && <ThemeEditor />}
      </main>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <p style={s.footerText}>© 2026 Kelompok PKPL · Semua hak dilindungi</p>
      </footer>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────

const PRIMARY = 'var(--primary-color, #4CAF50)';
const PRIMARY_BG = 'var(--primary-bg, #ffffff)';
const PRIMARY_TEXT = 'var(--primary-text, #1a1a1a)';

const s = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "var(--font-family, 'Segoe UI', sans-serif)",
    backgroundColor: '#f5f6fa',
    color: PRIMARY_TEXT,
  },

  // Loading
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    gap: '16px',
    backgroundColor: '#f5f6fa',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: `4px solid rgba(76,175,80,0.2)`,
    borderTop: `4px solid #4CAF50`,
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  loadingText: { fontSize: '14px', color: '#888', margin: 0 },

  // Header
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ebebeb',
    padding: '0 2rem',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
  },
  headerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: PRIMARY,
    flexShrink: 0,
  },
  brandText: {
    fontWeight: '700',
    fontSize: '16px',
    color: '#1a1a1a',
    letterSpacing: '-0.3px',
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f5f6fa',
    padding: '6px 6px 6px 6px',
    borderRadius: '40px',
    border: '1px solid #ebebeb',
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: PRIMARY,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
    flexShrink: 0,
  },
  userName: { fontSize: '13px', fontWeight: '500', color: '#333', paddingRight: '4px' },
  logoutBtn: {
    padding: '6px 14px',
    backgroundColor: '#fff',
    color: '#e53935',
    border: '1px solid #ffd0d0',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    transition: 'all 0.2s',
  },

  // Main
  main: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },

  // Login
  loginWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem',
    marginBottom: '3rem',
    position: 'relative',
  },
  blob: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    filter: 'blur(60px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  loginCard: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: '#ffffff',
    padding: '40px 36px',
    borderRadius: '20px',
    border: '1px solid #ebebeb',
    textAlign: 'center',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
  },
  lockIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    backgroundColor: 'rgba(76,175,80,0.08)',
    border: '1px solid rgba(76,175,80,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  loginTitle: {
    margin: '0 0 10px',
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a1a',
  },
  loginSub: {
    margin: '0 0 20px',
    fontSize: '14px',
    color: '#777',
    lineHeight: 1.6,
  },
  divider: {
    height: '1px',
    background: '#f0f0f0',
    margin: '20px 0',
  },
  googleWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  loginNote: {
    margin: 0,
    fontSize: '12px',
    color: '#bbb',
  },

  // Status banners
  bannerAdmin: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    backgroundColor: '#f0faf1',
    border: '1px solid #b6e5b8',
    padding: '14px 18px',
    borderRadius: '12px',
    marginBottom: '8px',
  },
  bannerGuest: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    backgroundColor: '#fff8f0',
    border: '1px solid #ffd9a8',
    padding: '14px 18px',
    borderRadius: '12px',
    marginBottom: '8px',
  },
  bannerDot: (isAdmin) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: isAdmin ? '#4CAF50' : '#FF9800',
    flexShrink: 0,
    marginTop: '4px',
  }),
  bannerTitle: {
    margin: '0 0 2px',
    fontWeight: '700',
    fontSize: '14px',
    color: '#1a1a1a',
  },
  bannerDesc: {
    margin: 0,
    fontSize: '13px',
    color: '#666',
  },

  // Footer
  footer: {
    textAlign: 'center',
    padding: '1.2rem',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #ebebeb',
  },
  footerText: { margin: 0, fontSize: '13px', color: '#aaa' },
};

export default App;