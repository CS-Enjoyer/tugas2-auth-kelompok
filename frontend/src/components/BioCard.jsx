import React, { useState, useContext } from 'react'; 
import { AuthContext } from '../context/AuthContext';

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function getActiveColor() {
  try {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-color')
        .trim() || '#4CAF50'
    );
  } catch {
    return '#4CAF50';
  }
}

function BioCard({ member, isSelected, onSelect }) {
  const { user } = useContext(AuthContext);
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const {
    name = '',
    npm = '-',
    prodi = '-',
    email = '-',
    role = '',
    avatar_url,
    is_member,
  } = member;

  const isViewerAdmin = user?.is_member;

  // Selalu pakai warna global dari CSS variable
  const color = getActiveColor();
  const isHex = color.startsWith('#');
  const bgLight = isHex ? hexToRgba(color, 0.07) : '#f9fffe';
  const borderActive = isHex ? hexToRgba(color, 0.35) : '#e5e7eb';

  const initials = getInitials(name);

  const isElevated = isSelected || hovered;

  return (
    <div
      onClick={() => isViewerAdmin && onSelect(member)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        border: `1.5px solid ${isElevated ? color : borderActive}`,
        borderRadius: '16px',
        boxShadow: isElevated
          ? `0 8px 28px 0 ${isHex ? hexToRgba(color, 0.18) : 'rgba(0,0,0,0.1)'}`
          : '0 1px 6px 0 rgba(0,0,0,0.06)',
        transform: isElevated ? 'translateY(-4px)' : 'none',
        transition: 'all 0.22s ease',
        cursor: isViewerAdmin ? 'pointer' : 'default',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Avatar + Name + Role ── */}
      <div
        style={{
          background: bgLight,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 20px 20px',
          gap: '10px',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
            transition: 'background 0.3s ease',
          }}
        >
          {avatar_url && !imgError ? (
            <img
              src={avatar_url}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <span
              style={{
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '28px',
                letterSpacing: '1px',
                userSelect: 'none',
              }}
            >
              {initials}
            </span>
          )}
        </div>

        {/* Name */}
        <p
          style={{
            margin: 0,
            fontWeight: '700',
            fontSize: '16px',
            color: isElevated ? color : '#1a1a1a',
            textAlign: 'center',
            lineHeight: 1.3,
            transition: 'color 0.2s',
          }}
        >
          {name}
        </p>

        {/* Role badge */}
        {role && (
          <span
            style={{
              padding: '3px 14px',
              borderRadius: '20px',
              border: `1px solid ${isHex ? hexToRgba(color, 0.3) : '#e5e7eb'}`,
              background: '#ffffff',
              color: '#666',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            {role}
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#f0f0f0' }} />

      {/* Info rows */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1,
        }}
      >
        <InfoRow icon={<EmailIcon />} value={email} isEmail color={color} />
        <InfoRow icon={<NpmIcon />}   value={npm}   color={color} />
        <InfoRow icon={<ProdiIcon />} value={prodi} color={color} />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#f0f0f0' }} />

      {/* Admin / Tamu footer */}
      <div
        style={{
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          background: is_member ? bgLight : '#fafafa',
          transition: 'background 0.3s ease',
        }}
      >
        {is_member ? (
          <>
            <CheckIcon color={color} />
            <span style={{ color: color, fontWeight: '600', fontSize: '13px', transition: 'color 0.3s' }}>
              Admin
            </span>
          </>
        ) : (
          <span style={{ color: '#aaa', fontSize: '13px' }}>Tamu</span>
        )}
      </div>
    </div>
  );
}

// ── Sub-components

function InfoRow({ icon, value, isEmail, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
      <span style={{ color: '#bbb', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      {isEmail ? (
        <a
          href={`mailto:${value}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            fontSize: '13px',
            color: color,
            textDecoration: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 0.3s',
          }}
        >
          {value}
        </a>
      ) : (
        <span
          style={{
            fontSize: '13px',
            color: '#444',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

function EmailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function NpmIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}

function ProdiIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5"/>
    </svg>
  );
}

function CheckIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  );
}

export default BioCard;