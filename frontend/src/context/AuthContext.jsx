import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user_data');
        const token = localStorage.getItem('access_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const loginWithGoogle = async (googleCredential) => {
        try {
            const response = await axiosInstance.post('/api/auth/google/', {
                id_token: googleCredential,
                access_token: googleCredential
            });

            console.log("Respon dari Django:", response.data);

            const token = response.data.access || response.data.key || response.data.access_token;
            const userInfo = response.data.user || response.data.user_info || {};

            localStorage.setItem('access_token', token);
            localStorage.setItem('user_data', JSON.stringify(userInfo));

            setUser(userInfo);
            return true;
        } catch (error) {
            console.error("Gagal verifikasi token ke backend:", error.response?.data || error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        setUser(null);
    };

    const loginDummy = (role) => {
        const dummyUser = role === 'admin'
            ? { name: 'Admin Dummy', email: 'admin@example.com', is_member: true }
            : { name: 'Guest Dummy', email: 'guest@example.com', is_member: false };

        localStorage.setItem('access_token', 'dummy-token');
        localStorage.setItem('user_data', JSON.stringify(dummyUser));
        setUser(dummyUser);
    };

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, logout, loginDummy, loading }}>
            {children}
        </AuthContext.Provider>
    );
};