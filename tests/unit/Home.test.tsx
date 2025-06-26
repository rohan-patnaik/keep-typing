import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../../src/pages/index';
import { useRouter } from 'next/router';

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Home Screen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders the home screen with title and options', () => {
    render(<Home />);
    expect(screen.getByText('keep-typing')).toBeInTheDocument();
    expect(screen.getByText('Test Duration')).toBeInTheDocument();
    expect(screen.getByText('Test Settings')).toBeInTheDocument();
    expect(screen.getByText('Start Test')).toBeInTheDocument();
  });

  it('allows selecting test duration', () => {
    render(<Home />);
    const thirtySecButton = screen.getByRole('button', { name: '30s' });
    const sixtySecButton = screen.getByRole('button', { name: '60s' });

    expect(thirtySecButton).toHaveClass('bg-teal-600'); // 30s is default
    expect(sixtySecButton).toHaveClass('bg-gray-700');

    fireEvent.click(sixtySecButton);
    expect(sixtySecButton).toHaveClass('bg-teal-600');
    expect(thirtySecButton).toHaveClass('bg-gray-700');
  });

  it('allows toggling punctuation setting', () => {
    render(<Home />);
    const punctuationButton = screen.getByRole('button', { name: /Punctuation/i });

    expect(punctuationButton).not.toHaveTextContent('✓');
    fireEvent.click(punctuationButton);
    expect(punctuationButton).toHaveTextContent('✓');
    fireEvent.click(punctuationButton);
    expect(punctuationButton).not.toHaveTextContent('✓');
  });

  it('allows toggling numbers setting', () => {
    render(<Home />);
    const numbersButton = screen.getByRole('button', { name: /Numbers/i });

    expect(numbersButton).not.toHaveTextContent('✓');
    fireEvent.click(numbersButton);
    expect(numbersButton).toHaveTextContent('✓');
    fireEvent.click(numbersButton);
    expect(numbersButton).not.toHaveTextContent('✓');
  });

  it('navigates to /test when Start Test button is clicked', () => {
    render(<Home />);
    const startTestButton = screen.getByRole('button', { name: 'Start Test' });
    fireEvent.click(startTestButton);
    expect(mockPush).toHaveBeenCalledWith('/test');
  });
});
