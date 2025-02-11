import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Index from '@/app';

describe('App Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Index />);
    expect(getByText('Welcome to React Native!')).toBeTruthy();
  });

  it('handles button press', () => {
    const { getByText } = render(<Index />);
    const button = getByText('Press Me');
    fireEvent.press(button);
    expect(getByText('Button Pressed!')).toBeTruthy();
  });
});