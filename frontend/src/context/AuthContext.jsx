import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cek apakah ada sesi tersimpan saat aplikasi pertama dimuat
    useEffect(() => {
        const storedUser = localStorage.getItem('user_data');
        const token = localStorage.getItem('access_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Fungsi login ini dipanggil SETELAH berhasil mendapatkan token dari Google
    const loginWithGoogle = async (googleCredential) => {
        try {
            // PENTING: Koordinasi dengan Role 2 untuk memastikan URL endpoint ini benar
            // Kita mengirim token Google ke Django untuk divalidasi
            const response = await axiosInstance.post('/api/auth/google/', {
                access_token: googleCredential
            });

            // Asumsi response dari Django mengembalikan token JWT internal dan data user
            const { access_token, user_info } = response.data;

            // Simpan token untuk authentikasi request selanjutnya
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user_data', JSON.stringify(user_info));
            
            setUser(user_info);
            return true;
        } catch (error) {
            console.error("Gagal verifikasi token ke backend:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};