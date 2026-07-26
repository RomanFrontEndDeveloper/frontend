'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
	theme: Theme;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === 'undefined') {
			return 'light';
		}

		return (localStorage.getItem('theme') as Theme) ?? 'light';
	});

	useEffect(() => {
		document.documentElement.classList.remove('light', 'dark');

		document.documentElement.classList.add(theme);

		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
	};

	return (
		<ThemeContext.Provider
			value={{
				theme,
				toggleTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('useTheme must be used inside ThemeProvider');
	}

	return context;
};
