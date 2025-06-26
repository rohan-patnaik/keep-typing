import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from '../../src/components/Auth/AuthForm';
import { supabase } from '../../src/lib/supabaseClient';
import { useRouter } from 'next/router';

// Mock Supabase and useRouter
jest.mock('../../src/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithOAuth: jest.fn(),
    },
  },
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('AuthForm', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    // Reset mocks before each test
    (supabase.auth.signInWithOAuth as jest.Mock).mockReset();
    mockPush.mockReset();
  });

  it('renders the Sign In with Google button', () => {
    render(<AuthForm />);
    expect(screen.getByRole('button', { name: /Sign In with Google/i })).toBeInTheDocument();
  });

  it('calls signInWithOAuth with google provider when button is clicked', async () => {
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<AuthForm />);
    fireEvent.click(screen.getByRole('button', { name: /Sign In with Google/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
    });
  });

  it('displays an error message if signInWithOAuth fails', async () => {
    const errorMessage = 'Google sign-in failed';
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({ error: { message: errorMessage } });

    render(<AuthForm />);
    fireEvent.click(screen.getByRole('button', { name: /Sign In with Google/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('does not redirect on successful sign-in (Supabase handles it)', async () => {
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<AuthForm />);
    fireEvent.click(screen.getByRole('button', { name: /Sign In with Google/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalled();
    });
    expect(mockPush).not.toHaveBeenCalled(); // Supabase handles the redirect
  });
});
