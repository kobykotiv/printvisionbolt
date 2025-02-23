import { createTheme, MantineThemeOverride } from '@mantine/core';

const lightColors = {
  // ...existing colors...
};

const darkColors = {
  background: '#1A1B1E',
  surface: '#25262B',
  border: '#2C2E33',
  text: '#C1C2C5',
  primary: '#228BE6',
  secondary: '#A5D8FF',
};

export const theme: MantineThemeOverride = {
  primaryColor: 'blue',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
    blue: [
      '#E7F5FF',
      '#D0EBFF',
      '#A5D8FF',
      '#74C0FC',
      '#4DABF7',
      '#339AF0',
      '#228BE6',
      '#1C7ED6',
      '#1971C2',
      '#1864AB',
    ],
  },
  shadows: {
    md: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    lg: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
  colorScheme: 'light',
  other: {
    darkColors,
    lightColors
  },
  components: {
    Card: {
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colorScheme === 'dark' ? darkColors.surface : 'white',
          borderColor: theme.colorScheme === 'dark' ? darkColors.border : theme.colors.dark[1],
        }
      })
    },
    Button: {
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colorScheme === 'dark' ? darkColors.primary : theme.colors.blue[6],
          color: theme.colorScheme === 'dark' ? darkColors.text : 'white',
        }
      })
    }
  }
};
