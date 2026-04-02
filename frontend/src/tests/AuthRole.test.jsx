import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ThemeEditor from '../components/ThemeEditor';
import { AuthContext } from '../context/AuthContext';

// Mocking Context Provider for ThemeEditor
const renderWithAuth = (user) => {
    return render(
        <AuthContext.Provider value={{ user }}>
            <ThemeEditor />
        </AuthContext.Provider>
    );
};

describe('ThemeEditor Access Control', () => {
    it('should render the editor if user is an Admin (is_member: true)', () => {
        const adminUser = { name: 'Admin', is_member: true };
        renderWithAuth(adminUser);

        expect(screen.getByText(/Editor Tema Website \(Admin\)/)).toBeInTheDocument();
    });

    it('should NOT render the editor if user is a Guest (is_member: false)', () => {
        const guestUser = { name: 'Guest', is_member: false };
        renderWithAuth(guestUser);

        // ThemeEditor should return null for non-members
        const editorHeader = screen.queryByText(/Editor Tema Website \(Admin\)/);
        expect(editorHeader).not.toBeInTheDocument();
    });
});
