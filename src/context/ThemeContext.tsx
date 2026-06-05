import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    isDarkMode: boolean; // Evaluated boolean indicating if dark mode is currently active
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Initialize theme from localStorage or default to system
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        const savedTheme = localStorage.getItem('theme-mode');
        return (savedTheme as ThemeMode) || 'system';
    });

    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // Apply the theme immediately and listen for system preference changes
    useEffect(() => {
        const applyTheme = (currentTheme: ThemeMode) => {
            const root = window.document.documentElement;
            let shouldBeDark = false;

            if (currentTheme === 'system') {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                shouldBeDark = systemPrefersDark;
            } else {
                shouldBeDark = currentTheme === 'dark';
            }

            if (shouldBeDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
            
            setIsDarkMode(shouldBeDark);
        };

        applyTheme(theme);

        // Listen for system changes if mode is 'system'
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        localStorage.setItem('theme-mode', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
