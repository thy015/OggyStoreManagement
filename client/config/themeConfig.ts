// themes/CustomThemes.ts
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    background: '#ffffff',
    text: '#000000',
    card: '#f5f5f5',
    border: '#cccccc',
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#bb86fc',
    background: '#121212',
    text: '#ffffff',
    card: '#1e1e1e',
    border: '#333333',
  },
};
