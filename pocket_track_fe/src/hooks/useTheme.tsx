import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';

export default function useTheme() {
  const [themeMode, setThemeMode] = useState<Theme>('auto');

  // Applica il tema al documento HTML
  function applyTheme(theme: 'light' | 'dark') {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    setThemeMode(theme);
    localStorage.setItem('theme', theme);
  }

  // Ripristina il comportamento automatico basato sul tema di sistema
  function resetTheme() {
    localStorage.removeItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const newTheme = prefersDark ? 'dark' : 'light';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    setThemeMode('auto');
  }

  // Cambia tema manualmente (alternare light/dark)
  function toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // Inizializzazione del tema all'avvio
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme);
      setThemeMode('auto');
    }

    // Listener per i cambiamenti del tema di sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  return {
    themeMode,
    applyTheme,
    toggleTheme,
    resetTheme,
  };
}
