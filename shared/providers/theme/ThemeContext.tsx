'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
	theme: Theme;
	mounted: boolean;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>('light');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as Theme | null;

		if (savedTheme === 'light' || savedTheme === 'dark') {
			setTheme(savedTheme);
		}

		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(theme);

		localStorage.setItem('theme', theme);
	}, [theme, mounted]);

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
	};

	return (
		<ThemeContext.Provider
			value={{
				theme,
				mounted,
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
