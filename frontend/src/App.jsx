import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from './context/AuthContext';
import './App.css';

function App() {
  const { user, loginWithGoogle, logout, loading } = useContext(AuthContext);

  const handleGoogleSuccess = async (credentialResponse) => {
    // credentialResponse.credential adalah JWT dari Google
    console.log("Token dari Google didapat!", credentialResponse);
    
    // Kirim token ke backend
    const success = await loginWithGoogle(credentialResponse.credential);
    if (success) {
      alert("Login berhasil diotorisasi backend!");
    } else {
      alert("Login gagal di sisi backend.");
    }
  };

  const handleGoogleError = () => {
    console.log('Login Google Gagal');
  };

  if (loading) return <div>Loading Auth State...</div>;

  return (
    <div className="app-container">
      <h1>Sistem Biodata Kelompok PKPL</h1>
      
      {!user ? (
        <div className="login-section">
          <p>Silakan login untuk mengubah tema.</p>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      ) : (
        <div className="dashboard-section">
          <h2>Halo, {user.name || 'Anggota'}!</h2>
          {/* Ini adalah implementasi "Conditional Rendering" untuk otorisasi dasar di UI */}
          {user.is_member ? (
            <div className="editor-panel">
              <h3>Panel Editor Tema (Protected)</h3>
              <p>Hanya anggota kelompok yang bisa melihat ini.</p>
              {/* Komponen <ThemeEditor /> milik Role 4 akan ditaruh di sini */}
            </div>
          ) : (
            <p>Anda login sebagai Guest. Anda hanya bisa melihat biodata.</p>
          )}
          
          <button onClick={logout} style={{ marginTop: '20px' }}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;