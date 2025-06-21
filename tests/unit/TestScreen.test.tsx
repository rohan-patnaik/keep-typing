import React from 'react';
import { render, screen, fireEvent } from
  '@testing-library/react';
import TestScreen, {
  TestScreenProps,
} from '../../src/components/TestScreen';
import { act } from 'react-dom/test-utils';

jest.useFakeTimers();

describe('TestScreen component', () => {
  const props: TestScreenProps = {
    text: 'hello',
    duration: 5,
  };

  beforeEach(() => {
    jest.clearAllTimers();
  });

  it('renders initial UI correctly', () => {
    render(<TestScreen {...props} />);
    expect(screen.getByText('Time: 5s')).toBeInTheDocument();
    expect(screen.getByText('WPM: 0')).toBeInTheDocument();
    expect(
      screen.getByText('Accuracy: 0.0%')
    ).toBeInTheDocument();
    expect(screen.queryByText(/CapsLock is on/))
      .not.toBeInTheDocument();
    const input = screen.getByRole(
      'textbox'
    ) as HTMLInputElement;
    expect(input).toBeDisabled();
    expect(screen.getByRole('button'))
      .toHaveTextContent('Start');
  });

  it('start/pause via button works and updates time', () => {
    render(<TestScreen {...props} />);
    const button = screen.getByRole('button');
    const input = screen.getByRole('textbox');

    fireEvent.click(button);
    expect(button).toHaveTextContent('Pause');
    expect(input).not.toBeDisabled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Time: 4s'))
      .toBeInTheDocument();

    fireEvent.click(button);
    expect(button).toHaveTextContent('Start');
    const prev = screen.getByText('Time: 4s').textContent;
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText(prev!))
      .toBeInTheDocument();
  });

  it('toggles on Enter key', () => {
    render(<TestScreen {...props} />);
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter' })
      );
    });
    expect(screen.getByRole('button'))
      .toHaveTextContent('Pause');
  });

  it('shows and hides caps lock warning', () => {
    render(<TestScreen {...props} />);
    // simulate CapsLock down (state = on)
    act(() => {
      const ev = new KeyboardEvent('keydown', {
        key: 'CapsLock',
      });
      Object.defineProperty(ev, 'getModifierState', {
        value: (key: string) => key === 'CapsLock',
      });
      window.dispatchEvent(ev);
    });
    expect(screen.getByText(/Warning: CapsLock is on/))
      .toBeInTheDocument();

    // simulate CapsLock up (state = off)
    act(() => {
      const ev = new KeyboardEvent('keyup', {
        key: 'CapsLock',
      });
      Object.defineProperty(ev, 'getModifierState', {
        value: () => false,
      });
      window.dispatchEvent(ev);
    });
    expect(screen.queryByText(/Warning: CapsLock is on/))
      .not.toBeInTheDocument();
  });

  it('updates metrics after typing and 1s elapsed', () => {
    render(<TestScreen {...props} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByRole('textbox');

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    fireEvent.change(input, { target: { value: 'h' } });
    // (1 keystroke/5)/(1/60)=12 WPM
    expect(screen.getByText('WPM: 12'))
      .toBeInTheDocument();
    expect(
      screen.getByText('Accuracy: 100.0%')
    ).toBeInTheDocument();
  });
});