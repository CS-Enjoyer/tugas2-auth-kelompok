import React, { useState, useContext } from 'react';
import axiosInstance from '../api/axios';
import { AuthContext } from '../context/AuthContext';

function ThemeEditor() {
  /**
   * Component untuk mengubah tema website (warna dan font)
   * Hanya ditampilkan untuk users yang is_member = true (Admin)
   * Mengirim perubahan ke backend: POST /api/update-theme/
   */
  const { user } = useContext(AuthContext);

  const [theme, setTheme] = useState({
    primaryColor: getCSSSVariable('--primary-color') || '#4CAF50',
    primaryBg: getCSSSVariable('--primary-bg') || '#ffffff',
    primaryText: getCSSSVariable('--primary-text') || '#333333',
    fontFamily: getCSSSVariable('--font-family') || "'Segoe UI', sans-serif",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Jika bukan admin, jangan tampilkan apa-apa (safety check)
  if (!user?.is_member) {
    return null;
  }

  function getCSSSVariable(varName) {
    /**
     * Fungsi helper untuk membaca nilai CSS variable dari DOM
     */
    try {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
    } catch {
      return null;
    }
  }

  const handleColorChange = (field, value) => {
    setTheme((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Update CSS variable immediately untuk live preview
    updateCSSVariable(field, value);
  };

  const handleFontChange = (value) => {
    setTheme((prev) => ({
      ...prev,
      fontFamily: value,
    }));
    updateCSSVariable('fontFamily', value);
  };

  const updateCSSVariable = (field, value) => {
    /**
     * Update CSS variable di DOM untuk live preview
     */
    const varMap = {
      primaryColor: '--primary-color',
      primaryBg: '--primary-bg',
      primaryText: '--primary-text',
      fontFamily: '--font-family',
    };

    const cssVar = varMap[field];
    if (cssVar) {
      document.documentElement.style.setProperty(cssVar, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const token = localStorage.getItem('access_token');

    // Jika sedang menggunakan akun dummy, simulasikan saja keberhasilannya
    // Karena backend tidak mengenali 'dummy-token' untuk autentikasi yang sesungguhnya.
    if (token === 'dummy-token') {
      setTimeout(() => {
        setMessage({
          type: 'success',
          text: '✓ [Dummy Mode] Tema berhasil disimpan secara lokal!',
        });
        setIsLoading(false);
      }, 800);
      return;
    }

    try {
      // Kirim perubahan tema ke backend
      const response = await axiosInstance.post('/api/update-theme/', {
        primary_color: theme.primaryColor,
        primary_bg: theme.primaryBg,
        primary_text: theme.primaryText,
        font_family: theme.fontFamily,
      });

      setMessage({
        type: 'success',
        text: '✓ Tema berhasil diperbarui di server!',
      });

      console.log('Theme updated:', response.data);
    } catch (error) {
      console.error('Error updating theme:', error);
      setMessage({
        type: 'error',
        text: '✗ Gagal memperbarui tema di server. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetTheme = () => {
    /**
     * Reset ke tema default
     */
    const defaultTheme = {
      primaryColor: '#4CAF50',
      primaryBg: '#ffffff',
      primaryText: '#333333',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    };

    setTheme(defaultTheme);
    Object.entries(defaultTheme).forEach(([key, value]) => {
      updateCSSVariable(key, value);
    });

    setMessage({
      type: 'info',
      text: '↺ Tema direset ke default.',
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🎨 Editor Tema Website (Admin)</h3>
        <p style={styles.subtitle}>
          Ubah warna dan font website untuk semua pengguna. Fitur ini hanya untuk Admin.
        </p>
      </div>

      {message && (
        <div
          className={`alert alert-${message.type}`}
          style={styles.alert}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Warna Primary */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="primaryColor">
            Warna Primary:
          </label>
          <div style={styles.colorInputWrapper}>
            <input
              id="primaryColor"
              type="color"
              value={theme.primaryColor}
              onChange={(e) =>
                handleColorChange('primaryColor', e.target.value)
              }
              style={styles.colorInput}
            />
            <input
              type="text"
              value={theme.primaryColor}
              onChange={(e) =>
                handleColorChange('primaryColor', e.target.value)
              }
              placeholder="#4CAF50"
              style={styles.textInput}
            />
          </div>
          <p style={styles.helperText}>
            Digunakan untuk navigasi, tombol, dan heading
          </p>
        </div>

        {/* Background Color */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="primaryBg">
            Warna Background:
          </label>
          <div style={styles.colorInputWrapper}>
            <input
              id="primaryBg"
              type="color"
              value={theme.primaryBg}
              onChange={(e) => handleColorChange('primaryBg', e.target.value)}
              style={styles.colorInput}
            />
            <input
              type="text"
              value={theme.primaryBg}
              onChange={(e) => handleColorChange('primaryBg', e.target.value)}
              placeholder="#ffffff"
              style={styles.textInput}
            />
          </div>
          <p style={styles.helperText}>
            Warna latar belakang utama
          </p>
        </div>

        {/* Text Color */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="primaryText">
            Warna Teks:
          </label>
          <div style={styles.colorInputWrapper}>
            <input
              id="primaryText"
              type="color"
              value={theme.primaryText}
              onChange={(e) =>
                handleColorChange('primaryText', e.target.value)
              }
              style={styles.colorInput}
            />
            <input
              type="text"
              value={theme.primaryText}
              onChange={(e) =>
                handleColorChange('primaryText', e.target.value)
              }
              placeholder="#333333"
              style={styles.textInput}
            />
          </div>
          <p style={styles.helperText}>Warna teks default</p>
        </div>

        {/* Font Selection */}
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="fontFamily">
            Font Family:
          </label>
          <select
            id="fontFamily"
            value={theme.fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
            style={styles.select}
          >
            <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
              Segoe UI (Default)
            </option>
            <option value="'Arial', sans-serif">Arial</option>
            <option value="'Georgia', serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Comic Sans MS', sans-serif">Comic Sans MS</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
            <option value="'Verdana', sans-serif">Verdana</option>
          </select>
          <p style={styles.helperText}>Font yang digunakan di seluruh website</p>
        </div>

        {/* Preview Section */}
        <div style={styles.previewSection}>
          <h4 style={styles.previewTitle}>Preview:</h4>
          <div
            style={{
              ...styles.preview,
              backgroundColor: theme.primaryBg,
              color: theme.primaryText,
              fontFamily: theme.fontFamily,
            }}
          >
            <h3 style={{ color: theme.primaryColor }}>
              Ini adalah preview heading
            </h3>
            <p>Dan ini adalah preview paragraph teks.</p>
            <button style={{ backgroundColor: theme.primaryColor }}>
              Preview Button
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitBtn,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? '⏳ Menyimpan...' : '💾 Simpan Tema'}
          </button>
          <button
            type="button"
            onClick={handleResetTheme}
            disabled={isLoading}
            style={styles.resetBtn}
          >
            ↺ Reset ke Default
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'var(--accent-bg)',
    border: `2px solid var(--primary-color)`,
    borderRadius: 'var(--border-radius)',
    padding: 'var(--spacing-lg)',
    marginTop: 'var(--spacing-lg)',
    width: '100%',
  },
  header: {
    marginBottom: 'var(--spacing-lg)',
    borderBottom: `2px solid var(--primary-color)`,
    paddingBottom: 'var(--spacing-md)',
  },
  title: {
    fontSize: 'var(--font-size-lg)',
    color: 'var(--primary-color)',
    marginBottom: 'var(--spacing-xs)',
  },
  subtitle: {
    color: '#666',
    fontSize: '0.9rem',
  },
  form: {
    marginTop: 'var(--spacing-md)',
  },
  formGroup: {
    marginBottom: 'var(--spacing-md)',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: 'var(--spacing-xs)',
    color: 'var(--primary-text)',
  },
  colorInputWrapper: {
    display: 'flex',
    gap: 'var(--spacing-sm)',
    marginBottom: 'var(--spacing-xs)',
  },
  colorInput: {
    width: '60px',
    height: '40px',
    border: '1px solid var(--neutral-border)',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
  },
  textInput: {
    flex: 1,
    padding: 'var(--spacing-xs) var(--spacing-sm)',
    border: '1px solid var(--neutral-border)',
    borderRadius: 'var(--border-radius)',
    fontFamily: 'monospace',
  },
  select: {
    width: '100%',
    padding: 'var(--spacing-xs) var(--spacing-sm)',
    border: '1px solid var(--neutral-border)',
    borderRadius: 'var(--border-radius)',
    fontFamily: 'var(--font-family)',
    backgroundColor: 'var(--primary-bg)',
    color: 'var(--primary-text)',
  },
  helperText: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '0.25rem',
  },
  alert: {
    marginBottom: 'var(--spacing-md)',
  },
  previewSection: {
    marginTop: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-lg)',
    backgroundColor: 'white',
    padding: 'var(--spacing-md)',
    borderRadius: 'var(--border-radius)',
    border: '1px dashed var(--neutral-border)',
  },
  previewTitle: {
    marginBottom: 'var(--spacing-md)',
    color: 'var(--primary-text)',
  },
  preview: {
    padding: 'var(--spacing-md)',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--neutral-border)',
    transition: 'all 0.3s ease',
  },
  buttonGroup: {
    display: 'flex',
    gap: 'var(--spacing-sm)',
    justifyContent: 'flex-end',
  },
  submitBtn: {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    padding: 'var(--spacing-xs) var(--spacing-md)',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  resetBtn: {
    backgroundColor: '#9E9E9E',
    color: 'white',
    padding: 'var(--spacing-xs) var(--spacing-md)',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
};

export default ThemeEditor;