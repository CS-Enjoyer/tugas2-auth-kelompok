import React, { useContext, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from './context/AuthContext';
import BioGrid from './components/BioGrid';
import ThemeEditor from './components/ThemeEditor';
import './styles/GlobalStyles.css';
import './App.css';

function App() {
  // Mengambil state dan fungsi dari AuthContext
  const { user, loginWithGoogle, logout, loading } = useContext(AuthContext);

  // Initialize CSS Variables dari backend theme
  useEffect(() => {
    if (user && user.theme) {
      const { primary_color, primary_bg, primary_text, font_family } = user.theme;
      if (primary_color) document.documentElement.style.setProperty('--primary-color', primary_color);
      if (primary_bg) document.documentElement.style.setProperty('--primary-bg', primary_bg);
      if (primary_text) document.documentElement.style.setProperty('--primary-text', primary_text);
      if (font_family) document.documentElement.style.setProperty('--font-family', font_family);
    }
  }, [user]);

  // Fungsi yang dipanggil saat Google berhasil memberikan token
  const handleSuccess = async (credentialResponse) => {
    console.log("1. Token dari Google diterima!");
    
    // Kirim token tersebut ke backend Django via Context
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

  // Jangan render apa-apa sampai pengecekan sesi selesai
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
          <h1 style={styles.title}>📚 Tugas PKPL - Kelompok</h1>
          {user && (
            <div style={styles.userInfo}>
              <span>👤 {user.name || user.email}</span>
              <button 
                onClick={logout}
                style={styles.logoutBtn}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Jika belum login (user === null) */}
        {!user ? (
          <div style={styles.loginSection}>
            <div style={styles.loginCard}>
              <h2>🔐 Silakan Login</h2>
              <p style={styles.loginDescription}>
                Login menggunakan akun Google untuk melihat biodata kelompok dan mengakses fitur lainnya.
              </p>
              <GoogleLogin 
                onSuccess={handleSuccess} 
                onError={handleError} 
              />
            </div>

            {/* Biodata Preview (tanpa fitur ThemeEditor) */}
            <BioGrid />

            {/* Testing Button */}
            <div style={styles.testingSection}>
              <button 
                onClick={() => {
                  const dummyUser = { 
                    name: "admin", 
                    email: "bypass@gmail.com", 
                    is_member: true
                  };
                  localStorage.setItem('user_data', JSON.stringify(dummyUser));
                  localStorage.setItem('access_token', 'token_palsu_123');
                  window.location.reload();
                }}
                style={styles.testingBtn}
              >
                🛠️ Test Login (Admin/Member)
              </button>
              <button 
                onClick={() => {
                  const dummyUser = { 
                    name: "visitor", 
                    email: "guest@gmail.com", 
                    is_member: false
                  };
                  localStorage.setItem('user_data', JSON.stringify(dummyUser));
                  localStorage.setItem('access_token', 'token_palsu_123');
                  window.location.reload();
                }}
                style={styles.testingBtn}
              >
                🛠️ Test Login (Guest)
              </button>
            </div>
          </div>
        ) : (
          /* Jika SUDAH login */
          <div style={styles.dashboardContainer}>
            {/* Status & Introduction */}
            <div style={styles.statusCard}>
              <h2>👋 Selamat datang, {user.name || user.email}!</h2>
              <p>Email: {user.email}</p>

              {user.is_member ? (
                <div style={styles.memberStatus}>
                  <h3>✓ Status: Anggota Kelompok</h3>
                  <p>Anda memiliki akses penuh kepada semua fitur, termasuk editor tema.</p>
                </div>
              ) : (
                <div style={styles.guestStatus}>
                  <h3>👤 Status: Pengunjung</h3>
                  <p>Anda dapat melihat biodata kelompok namun tidak dapat mengubah tema.</p>
                </div>
              )}
            </div>

            {/* Biodata Grid - ditampilkan untuk semua user */}
            <BioGrid />

            {/* Theme Editor - hanya untuk members */}
            {user.is_member && <ThemeEditor />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Kelompok PKPL. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}

// ===== Styles =====
const styles = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--primary-bg)',
    color: 'var(--primary-text)',
    fontFamily: 'var(--font-family)',
  },
  header: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    padding: 'var(--spacing-lg)',
    boxShadow: 'var(--box-shadow)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  title: {
    fontSize: 'var(--font-size-xl)',
    fontWeight: '700',
    margin: 0,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    color: 'white',
  },
  logoutBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: 'var(--spacing-xs) var(--spacing-md)',
    border: '1px solid white',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  main: {
    flex: 1,
    padding: 'var(--spacing-lg)',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--primary-bg)',
  },
  loadingText: {
    fontSize: 'var(--font-size-lg)',
    color: 'var(--primary-color)',
    fontWeight: '600',
  },
  loginSection: {
    width: '100%',
  },
  loginCard: {
    backgroundColor: 'var(--accent-bg)',
    border: `2px solid var(--primary-color)`,
    borderRadius: 'var(--border-radius)',
    padding: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-lg)',
    textAlign: 'center',
  },
  loginDescription: {
    marginBottom: 'var(--spacing-md)',
    color: '#666',
  },
  dashboardContainer: {
    width: '100%',
  },
  statusCard: {
    backgroundColor: 'var(--accent-bg)',
    border: `1px solid var(--primary-color)`,
    borderRadius: 'var(--border-radius)',
    padding: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-lg)',
  },
  memberStatus: {
    backgroundColor: '#e8f5e9',
    border: '1px solid #4CAF50',
    borderRadius: 'var(--border-radius)',
    padding: 'var(--spacing-md)',
    marginTop: 'var(--spacing-md)',
  },
  guestStatus: {
    backgroundColor: '#fff3e0',
    border: '1px solid #ff9800',
    borderRadius: 'var(--border-radius)',
    padding: 'var(--spacing-md)',
    marginTop: 'var(--spacing-md)',
  },
  testingSection: {
    display: 'flex',
    gap: 'var(--spacing-md)',
    justifyContent: 'center',
    marginTop: 'var(--spacing-lg)',
    flexWrap: 'wrap',
  },
  testingBtn: {
    backgroundColor: '#333',
    color: 'white',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    border: '1px dashed #777',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  footer: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    textAlign: 'center',
    padding: 'var(--spacing-md)',
    marginTop: 'auto',
  },
};

export default App;