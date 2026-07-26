'use client';

import { useAuth } from '@/shared/providers/auth/useAuth';
import { Container } from '@/shared/ui/Container';
import { Logo } from '@/shared/ui/Logo';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { Navigation } from '@/widgets/Navigation';

export const Header = () => {
	const { user } = useAuth();

	return (
		<header className='border-b border-gray-200 dark:border-gray-700 transition-colors duration-200'>
			<Container>
				<div className='flex h-16 items-center justify-between'>
					<Logo />

					{user && (
						<span className='text-gray-700 dark:text-gray-300'>
							{user.email}
						</span>
					)}

					<div className='flex items-center gap-6'>
						<Navigation />
						<ThemeToggle />
					</div>
				</div>
			</Container>
		</header>
	);
};
