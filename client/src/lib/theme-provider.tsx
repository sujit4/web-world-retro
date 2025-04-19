import { createContext, useContext, useEffect, useState } from 'react';
import theme from '../../../theme.json';

type Theme = {
  variant: 'tint' | 'solid';
  primary: string;
  appearance: 'light' | 'dark';
  radius: number;
};

const ThemeContext = createContext<Theme>(theme as Theme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme.appearance);
    root.style.setProperty('--radius', `${theme.radius}px`);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={theme as Theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 