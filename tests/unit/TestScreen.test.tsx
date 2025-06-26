import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import TestScreen from '../../src/pages/test'; // Updated import path
import { useRouter } from 'next/router';
import { supabase } from '../../src/lib/supabaseClient';
import { AuthProvider } from '../../src/contexts/AuthContext'; // Import AuthProvider

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock Supabase client
jest.mock('../../src/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

jest.useFakeTimers();

describe('TestScreen', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (useRouter as jest.Mock).mockClear();
    (supabase.auth.getSession as jest.Mock).mockClear();
    (supabase.auth.onAuthStateChange as jest.Mock).mockClear();
  });

  it('renders the component', async () => {
    let component;
    await act(async () => {
      component = render(
        <AuthProvider>
          <TestScreen />
        </AuthProvider>
      );
    });
    expect(screen.getByText('Typing Test')).toBeInTheDocument();
  });

  it('starts the timer on input', async () => {
    let component;
    await act(async () => {
      component = render(
        <AuthProvider>
          <TestScreen />
        </AuthProvider>
      );
    });
    const input = screen.getByRole('textbox', { hidden: true }); // Find hidden textbox
    fireEvent.change(input, { target: { value: 'a' } });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('time-left')).toHaveTextContent('29s');
  });

  it('finishes the test when the timer runs out', async () => {
    let component;
    await act(async () => {
      component = render(
        <AuthProvider>
          <TestScreen />
        </AuthProvider>
      );
    });
    const input = screen.getByRole('textbox', { hidden: true }); // Find hidden textbox
    fireEvent.change(input, { target: { value: 'a' } });
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    expect(screen.getByText('Test Complete!')).toBeInTheDocument();
  });

  it('resets the test when the reset button is clicked', async () => {
    let component;
    await act(async () => {
      component = render(
        <AuthProvider>
          <TestScreen />
        </AuthProvider>
      );
    });
    const input = screen.getByRole('textbox', { hidden: true }); // Find hidden textbox
    fireEvent.change(input, { target: { value: 'a' } });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    expect(screen.getByTestId('time-left')).toHaveTextContent('30s');
  });
});
