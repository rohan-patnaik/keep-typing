
import { render, screen, fireEvent, act } from '@testing-library/react';
import TestScreen from '../../src/pages/index';

jest.useFakeTimers();

describe('TestScreen', () => {
  it('renders the component', () => {
    render(<TestScreen />);
    expect(screen.getByText('Typing Test')).toBeInTheDocument();
  });

  it('starts the timer on input', () => {
    render(<TestScreen />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('time-left')).toHaveTextContent('29s');
  });

  it('finishes the test when the timer runs out', () => {
    render(<TestScreen />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    expect(screen.getByText('Test Complete!')).toBeInTheDocument();
  });

  it('resets the test when the reset button is clicked', () => {
    render(<TestScreen />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    expect(screen.getByTestId('time-left')).toHaveTextContent('30s');
  });
});
