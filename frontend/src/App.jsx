import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from './context/AuthContext';
import './App.css'; // Opsional, hapus jika tidak pakai styling bawaan

function App() {
  // Mengambil state dan fungsi dari AuthContext
  const { user, loginWithGoogle, logout, loading } = useContext(AuthContext);

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
  if (loading) return <div>Memuat data pengguna...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Tugas PKPL - Kelompok</h1>
      
      {/* Jika belum login (user === null) */}
      {!user ? (
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <h2>Silakan Login</h2>
          <p>Login menggunakan akun Google UI atau pribadi Anda.</p>
          <GoogleLogin 
            onSuccess={handleSuccess} 
            onError={handleError} 
          />
        </div>
      ) : (
        /* Jika SUDAH login */
        <div style={{ border: '1px solid #4CAF50', padding: '1rem', borderRadius: '8px' }}>
          <h2>Selamat datang, {user.name || user.email}!</h2>
          <p>Email: {user.email}</p>
          
          {/* SIMULASI OTORISASI (AUTHORIZATION) */}
          {/* Asumsi: Backend mengembalikan atribut 'is_member' bernilai true/false */}
          {user.is_member ? (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e8f5e9' }}>
              <h3>🎨 Panel Editor Tema (Protected Area)</h3>
              <p>Karena Anda adalah anggota kelompok, Anda berhak mengubah tema website.</p>
              {/* Nanti komponen ubah warna dari Role 4 ditaruh di sini */}
              <button disabled>Simulasi Tombol Ubah Warna</button>
            </div>
          ) : (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#ffebee' }}>
              <h3>🔒 Akses Terbatas</h3>
              <p>Anda login sebagai pengunjung luar. Anda hanya dapat melihat biodata kelompok.</p>
            </div>
          )}

          <button 
            onClick={logout} 
            style={{ marginTop: '20px', padding: '8px 16px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <GoogleLogin 
          onSuccess={handleSuccess} 
          onError={handleError} 
          />
          
          {/* TAMBAHKAN TOMBOL INI UNTUK TESTING */}
          <button 
            onClick={() => {
              // Simulasi data yang seolah-olah dikembalikan oleh Django
              const dummyUser = { 
                name: "admin", 
                email: "bypass@gmail.com", 
                is_member: true // Coba ganti jadi false untuk tes UI Guest
              };
              localStorage.setItem('user_data', JSON.stringify(dummyUser));
              localStorage.setItem('access_token', 'token_palsu_123');
              window.location.reload(); // Refresh halaman agar useEffect di Context membaca localStorage
            }}
            style={{ padding: '8px 16px', backgroundColor: '#333', color: 'white', border: '1px dashed #777', cursor: 'pointer' }}
          >
            🛠️ Bypass Login (Test UI Anggota)
          </button>
        </div>
    </div>
  );
}

export default App;