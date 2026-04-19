import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#94a3b8', // Slate 400
    },
    background: {
      default: '#0f172a', // Slate 900
      paper: '#1e293b',   // Slate 800
    },
    text: {
      primary: '#f1f5f9', // Slate 100
      secondary: '#94a3b8', // Slate 400
    },
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid currentColor',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
        contained: {
          backgroundColor: '#f1f5f9',
          color: '#0f172a',
          '&:hover': {
            backgroundColor: '#cbd5e1',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: '2px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
});

