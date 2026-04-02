import React, { useContext, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from './context/AuthContext';
import BioGrid from './components/BioGrid';
import ThemeEditor from './components/ThemeEditor';
import './styles/GlobalStyles.css';

function App() {
  const { user, loginWithGoogle, logout, loginDummy, loading } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.theme) {
      const { primary_color, primary_bg, primary_text, font_family } = user.theme;
      if (primary_color) document.documentElement.style.setProperty('--primary-color', primary_color);
      if (primary_bg) document.documentElement.style.setProperty('--primary-bg', primary_bg);
      if (primary_text) document.documentElement.style.setProperty('--primary-text', primary_text);
      if (font_family) document.documentElement.style.setProperty('--font-family', font_family);
    }
  }, [user]);

  const handleSuccess = async (credentialResponse) => {
    console.log("1. Token dari Google diterima!");
    const success = await loginWithGoogle(credentialResponse.credential);

    if (success) {
      console.log("2. Login backend berhasil!");
    } else {
      alert("Gagal memverifikasi login di server kita.");
    }
  };

  const handleError = () => {
    console.log('Login Google Gagal');
  };

  // Tampilan saat pertama kali dimuat (mengecek sesi)
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>⏳ Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>🎭 Tugas PKPL - Kelompok</h1>
          {user && (
            <div style={styles.userInfo}>
              <span>👤 {user.name || user.email}</span>
              <button onClick={logout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Jika belum login */}
        {!user ? (
          <div style={styles.loginSection}>
            <div style={styles.loginCard}>
              <h2>🔒 Silakan Login</h2>
              <p style={styles.loginDescription}>
                Login menggunakan akun Google untuk melihat biodata kelompok dan mengakses fitur lainnya.
              </p>
              <GoogleLogin onSuccess={handleSuccess} onError={handleError} />

              <div style={styles.dummyLoginSection}>
                <p style={styles.dummyLoginText}>--- ATAU COBA DUMMY ---</p>
                <div style={styles.dummyLoginButtons}>
                  <button onClick={() => loginDummy('admin')} style={styles.adminDummyBtn}>
                    🔑 Login Admin
                  </button>
                  <button onClick={() => loginDummy('guest')} style={styles.guestDummyBtn}>
                    👤 Login Tamu
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Jika sudah login, cek status role-nya */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {user.is_member ? (
              <div style={styles.memberStatus}>
                <h3>✔️ Status: Admin</h3>
                <p>Anda memiliki akses penuh kepada semua fitur, termasuk editor tema.</p>
              </div>
            ) : (
              <div style={styles.guestStatus}>
                <h3>👤 Status: Tamu</h3>
                <p>Anda dapat melihat biodata kelompok namun tidak dapat mengubah tema.</p>
              </div>
            )}
          </div>
        )}

        {/* Biodata Grid - Ditampilkan untuk semua user */}
        <BioGrid />

        {/* Theme Editor - HANYA ditampikan jika user adalah member kelompok */}
        {user?.is_member && <ThemeEditor />}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Kelompok PKPL. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}

// ----- Styles -----
// (Saya buatkan ulang full styling-nya agar tampilan UI dari temanmu tetap rapi 
// saat kamu copy-paste keseluruhan file ini)
const styles = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'var(--font-family, sans-serif)',
    backgroundColor: 'var(--primary-bg, #121212)',
    color: 'var(--primary-text, #ffffff)',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#121212',
    color: '#fff',
  },
  loadingText: { fontSize: '1.2rem' },
  header: {
    backgroundColor: '#1e1e1e',
    padding: '1rem 2rem',
    borderBottom: '1px solid #333',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: { margin: 0, fontSize: '1.5rem' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  main: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  loginSection: { display: 'flex', justifyContent: 'center', marginTop: '3rem', marginBottom: '3rem' },
  loginCard: {
    backgroundColor: '#1e1e1e',
    padding: '2.5rem',
    borderRadius: '8px',
    border: '1px solid #333',
    textAlign: 'center',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
  },
  loginDescription: { color: '#aaa', marginBottom: '2rem' },
  dummyLoginSection: { marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #333' },
  dummyLoginText: { color: '#666', fontSize: '0.8rem', marginBottom: '1rem', letterSpacing: '1px' },
  dummyLoginButtons: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  adminDummyBtn: {
    padding: '10px',
    backgroundColor: '#198754',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s'
  },
  guestDummyBtn: {
    padding: '10px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s'
  },
  memberStatus: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    border: '1px solid #4caf50',
    padding: '1rem',
    borderRadius: '8px',
  },
  guestStatus: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    border: '1px solid #ff9800',
    padding: '1rem',
    borderRadius: '8px',
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#1e1e1e',
    borderTop: '1px solid #333',
    fontSize: '0.9rem',
    color: '#888',
  },
};

export default App;