'use client';

import { Button } from '../Button';
import { useTheme } from '@/shared/providers/theme/ThemeContext';

export const ThemeToggle = () => {
	const { theme, mounted, toggleTheme } = useTheme();

	if (!mounted) {
		return null;
	}

	return (
		<Button variant='secondary' onClick={toggleTheme}>
			{theme === 'light' ? '🌙 Dark' : '☀️ Light'}
		</Button>
	);
};
