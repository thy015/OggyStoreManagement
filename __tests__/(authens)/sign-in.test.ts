import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignIn from '@/app/(authens)/sign-in';

jest.mock('@/app/api/(authens)/sign-in', () => ({
  signIn: jest.fn(async (email, password) => {
    if (email === 'test@example.com' && password === 'password123') {
      return { success: true, message: 'Welcome' };
    }
    throw new Error('Invalid credentials');
  }),
}));

describe('SignInScreen', () => {
  it('should sign in successfully with correct credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn></SignIn>);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Welcome')).toBeTruthy();
    });
  });

  it('should show an error with incorrect credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn></SignIn>);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'wrong@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeTruthy();
    });
  });
});
