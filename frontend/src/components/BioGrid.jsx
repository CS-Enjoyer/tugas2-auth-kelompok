import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import BioCard from './BioCard';

const MEMBER_COLORS = [
  '#4CAF50',
  '#2196F3',
  '#E91E63',
  '#FF9800',
  '#9C27B0',
  '#00BCD4',
];

function BioGrid() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/members/');
      const data = response.data?.results ?? response.data ?? [];
      const enriched = data.map((m, i) => ({
        ...m,
        theme_color: m.theme_color || MEMBER_COLORS[i % MEMBER_COLORS.length],
      }));
      setMembers(enriched);
      setError(null);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Gagal mengambil data anggota. Menggunakan data lokal.');
      setMembers(getDummyMembers());
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMember = (member) => {
    if (selectedMember?.id === member.id) {
      setSelectedMember(null);
      applyThemeColor(null);
    } else {
      setSelectedMember(member);
      applyThemeColor(member.theme_color);
    }
  };

  const applyThemeColor = (color) => {
    const root = document.documentElement;
    if (color) {
      root.style.setProperty('--primary-color', color);
      root.style.setProperty('--primary-bg', lightenColor(color, 0.96));
      root.style.setProperty('--accent-color', color);
    } else {
      root.style.setProperty('--primary-color', '#4CAF50');
      root.style.setProperty('--primary-bg', '#ffffff');
      root.style.setProperty('--accent-color', '#2196F3');
    }
  };

  const lightenColor = (hex, amount) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    const r = Math.round((num >> 16) + (255 - (num >> 16)) * amount);
    const g = Math.round(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount);
    const b = Math.round((num & 0xff) + (255 - (num & 0xff)) * amount);
    return `rgb(${r},${g},${b})`;
  };

  const getDummyMembers = () => [
    { id: 1, name: 'Anita Wijaya',    email: 'anita@example.com',  role: 'UI/UX Developer',    avatar_url: 'https://via.placeholder.com/150?text=AW', phone: '+62812345678', is_member: true,  theme_color: '#4CAF50' },
    { id: 2, name: 'Budi Santoso',    email: 'budi@example.com',   role: 'Backend Developer',  avatar_url: 'https://via.placeholder.com/150?text=BS', phone: '+62812345679', is_member: true,  theme_color: '#2196F3' },
    { id: 3, name: 'Citra Dewi',      email: 'citra@example.com',  role: 'Frontend Developer', avatar_url: 'https://via.placeholder.com/150?text=CD', phone: '+62812345680', is_member: true,  theme_color: '#E91E63' },
    { id: 4, name: 'Doni Prasetyo',   email: 'doni@example.com',   role: 'Database Admin',     avatar_url: 'https://via.placeholder.com/150?text=DP', phone: '+62812345681', is_member: true,  theme_color: '#FF9800' },
    { id: 5, name: 'Eka Susanto',     email: 'eka@example.com',    role: 'QA Tester',          avatar_url: 'https://via.placeholder.com/150?text=ES', phone: '+62812345682', is_member: false, theme_color: '#9C27B0' },
    { id: 6, name: 'Fitri Handayani', email: 'fitri@example.com',  role: 'Project Manager',    avatar_url: 'https://via.placeholder.com/150?text=FH', phone: '+62812345683', is_member: true,  theme_color: '#00BCD4' },
  ];

  const activeColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color').trim() || '#4CAF50';

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] w-full gap-4">
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: `${activeColor} transparent transparent transparent` }}
        />
        <p className="text-sm font-medium text-gray-400">Memuat data anggota...</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-2">

      {/* Section Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: activeColor }}
            />
            <h2 className="text-lg font-bold tracking-tight text-gray-800">
              Anggota Kelompok
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Warna dot indicator per anggota */}
          <div className="flex gap-1">
            {members.map((m) => (
              <div
                key={m.id}
                onClick={() => handleSelectMember(m)}
                className="w-3 h-3 rounded-full cursor-pointer transition-all duration-200 hover:scale-125"
                style={{
                  backgroundColor: m.theme_color,
                  boxShadow: selectedMember?.id === m.id
                    ? `0 0 0 2px white, 0 0 0 3px ${m.theme_color}`
                    : 'none',
                }}
                title={m.name}
              />
            ))}
          </div>

          {selectedMember && (
            <button
              onClick={() => { setSelectedMember(null); applyThemeColor(null); }}
              className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 hover:opacity-80"
              style={{ borderColor: selectedMember.theme_color, color: selectedMember.theme_color }}
            >
              ↺ Reset
            </button>
          )}
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-300 mb-5 ml-3 italic">
        Klik kartu untuk mengubah tema warna halaman
      </p>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mb-5">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Grid */}
      {members.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-400 text-sm mb-3">Tidak ada data anggota.</p>
          <button
            onClick={fetchMembers}
            className="text-sm px-4 py-2 rounded-full text-white font-medium transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: activeColor }}
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member) => (
            <BioCard
              key={member.id}
              member={member}
              isSelected={selectedMember?.id === member.id}
              onSelect={handleSelectMember}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BioGrid;