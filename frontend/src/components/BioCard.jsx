import React, { useState } from 'react';

function BioCard({ member, isSelected, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    name = 'Unknown',
    email = '',
    role = 'Member',
    avatar_url = '',
    phone = '-',
    is_member = false,
    theme_color = '#4CAF50',
  } = member || {};

  const activeColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color')
    .trim() || '#4CAF50';

  const displayColor = isSelected ? theme_color : activeColor;
  const isActive = isSelected || isHovered;

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const cardStyle = isSelected
    ? {
        borderColor: theme_color,
        borderWidth: '2px',
        borderStyle: 'solid',
        backgroundColor: `${theme_color}08`,
        boxShadow: `0 12px 40px ${theme_color}25`,
        transform: 'translateY(-6px)',
      }
    : isHovered
    ? {
        borderColor: activeColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        backgroundColor: '#fff',
        boxShadow: `0 10px 32px ${activeColor}20`,
        transform: 'translateY(-4px)',
      }
    : {
        border: '1.5px solid #ebebeb',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transform: 'translateY(0)',
      };

  return (
    <div
      onClick={() => onSelect && onSelect(member)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        borderRadius: '16px',
        padding: '28px 24px 24px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        /* Kunci: semua kartu tinggi sama */
        height: '360px',
        ...cardStyle,
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '3px',
        borderRadius: '16px 16px 0 0',
        background: isActive
          ? `linear-gradient(90deg, ${displayColor}, ${displayColor}70)`
          : 'transparent',
        transition: 'all 0.3s ease',
      }} />

      {/* Selected checkmark */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '12px', right: '12px',
          width: '22px', height: '22px',
          borderRadius: '50%',
          backgroundColor: theme_color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '11px', fontWeight: 'bold',
          boxShadow: `0 2px 8px ${theme_color}50`,
        }}>✓</div>
      )}

      {/* ── Avatar ── fixed size, always centered */}
      <div style={{ position: 'relative', marginBottom: '16px', flexShrink: 0 }}>
        {/* Glow */}
        {isActive && (
          <div style={{
            position: 'absolute', inset: '-6px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${displayColor}25 0%, transparent 70%)`,
          }} />
        )}
        <div style={{
          width: '88px', height: '88px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `3px solid ${isActive ? displayColor : '#e5e7eb'}`,
          boxShadow: isActive ? `0 0 0 3px ${displayColor}20` : 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          backgroundColor: displayColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
        }}>
          {avatar_url ? (
            <img
              src={avatar_url}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : null}
          {/* Initials fallback (selalu ada di belakang img) */}
          <span style={{
            position: 'absolute',
            color: 'white',
            fontWeight: '700',
            fontSize: '26px',
            letterSpacing: '0.5px',
            userSelect: 'none',
          }}>{initials}</span>
        </div>
      </div>

      {/* ── Name ── fixed line-height, no wrap */}
      <h3 style={{
        fontSize: '15px',
        fontWeight: '700',
        color: isActive ? displayColor : '#1a1a2e',
        margin: '0 0 6px',
        transition: 'color 0.3s ease',
        textAlign: 'center',
        lineHeight: '1.3',
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>{name}</h3>

      {/* ── Role pill ── fixed height */}
      <span style={{
        display: 'inline-block',
        fontSize: '11px',
        fontWeight: '600',
        padding: '3px 12px',
        borderRadius: '20px',
        marginBottom: '16px',
        height: '22px',
        lineHeight: '16px',
        backgroundColor: isActive ? `${displayColor}15` : '#f4f4f5',
        color: isActive ? displayColor : '#71717a',
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap',
      }}>{role}</span>

      {/* ── Divider ── */}
      <div style={{
        width: '100%',
        height: '1px',
        background: isActive
          ? `linear-gradient(90deg, transparent, ${displayColor}40, transparent)`
          : 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
        marginBottom: '14px',
        transition: 'all 0.3s ease',
        flexShrink: 0,
      }} />

      {/* ── Info rows ── flex-grow mengisi sisa ruang */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
      }}>
        {/* Email */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '24px', height: '24px', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', flexShrink: 0,
            backgroundColor: isActive ? `${displayColor}15` : '#f4f4f5',
            color: isActive ? displayColor : '#9ca3af',
            transition: 'all 0.3s ease',
          }}>✉</span>
          <a
            href={`mailto:${email}`}
            onClick={(e) => e.stopPropagation()}
            title={email}
            style={{
              fontSize: '12px',
              color: isActive ? displayColor : '#52525b',
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'color 0.3s ease',
            }}
          >
            {email.length > 24 ? email.substring(0, 24) + '…' : email}
          </a>
        </div>

        {/* Phone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '24px', height: '24px', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', flexShrink: 0,
            backgroundColor: isActive ? `${displayColor}15` : '#f4f4f5',
            color: isActive ? displayColor : '#9ca3af',
            transition: 'all 0.3s ease',
          }}>☏</span>
          <span style={{ fontSize: '12px', color: '#52525b' }}>{phone}</span>
        </div>
      </div>

      {/* ── Member badge ── selalu di bawah, fixed */}
      <div style={{
        width: '100%',
        paddingTop: '12px',
        borderTop: '1px solid #f0f0f0',
        marginTop: '12px',
        flexShrink: 0,
      }}>
        {is_member ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px',
            padding: '6px 0',
            borderRadius: '8px',
            fontSize: '12px', fontWeight: '600',
            backgroundColor: isActive ? `${displayColor}12` : '#f0fdf4',
            color: isActive ? displayColor : '#16a34a',
            transition: 'all 0.3s ease',
          }}>
            <span style={{
              width: '16px', height: '16px', borderRadius: '50%',
              backgroundColor: isActive ? displayColor : '#22c55e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '9px',
              transition: 'background-color 0.3s ease',
            }}>✓</span>
            Anggota Kelompok
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', padding: '6px 0', borderRadius: '8px',
            fontSize: '12px', fontWeight: '600',
            backgroundColor: '#f8f8f8', color: '#9ca3af',
          }}>
            <span style={{
              width: '16px', height: '16px', borderRadius: '50%',
              backgroundColor: '#d1d5db',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '9px',
            }}>?</span>
            Tamu
          </div>
        )}
      </div>
    </div>
  );
}

export default BioCard;