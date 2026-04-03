import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ThemeEditor from '../components/ThemeEditor';
import BioCard from '../components/BioCard';
import { AuthContext } from '../context/AuthContext';

// Mocking Context Provider for testing components
const renderWithAuth = (ui, user = null) => {
    return render(
        <AuthContext.Provider value={{ user, loading: false }}>
            {ui}
        </AuthContext.Provider>
    );
};

describe('ThemeEditor Access Control', () => {
    it('should render the editor if user is an Admin (is_member: true)', () => {
        const adminUser = { name: 'Admin User', is_member: true };
        renderWithAuth(<ThemeEditor />, adminUser);

        expect(screen.getByText(/Editor Tema Website \(Admin\)/)).toBeInTheDocument();
    });

    it('should NOT render the editor if user is a Guest (is_member: false)', () => {
        const guestUser = { name: 'Guest User', is_member: false };
        renderWithAuth(<ThemeEditor />, guestUser);

        const editorHeader = screen.queryByText(/Editor Tema Website \(Admin\)/);
        expect(editorHeader).not.toBeInTheDocument();
    });
});

describe('BioCard Component', () => {
    const mockMember = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer',
        is_member: true
    };

    it('should display "Admin" badge for group members', () => {
        renderWithAuth(<BioCard member={mockMember} />, { is_member: true });
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('should display "Tamu" badge for non-members', () => {
        const nonMember = { ...mockMember, is_member: false };
        renderWithAuth(<BioCard member={nonMember} />, { is_member: true });
        expect(screen.getByText('Tamu')).toBeInTheDocument();
    });

    it('should disable click cursor if current user is NOT an Admin', () => {
        const guestUser = { is_member: false };
        const { container } = renderWithAuth(<BioCard member={mockMember} />, guestUser);
        const card = container.firstChild;
        expect(card.style.cursor).toBe('default');
    });

    it('should enable click cursor if current user IS an Admin', () => {
        const adminUser = { is_member: true };
        const { container } = renderWithAuth(<BioCard member={mockMember} />, adminUser);
        const card = container.firstChild;
        expect(card.style.cursor).toBe('pointer');
    });
});
