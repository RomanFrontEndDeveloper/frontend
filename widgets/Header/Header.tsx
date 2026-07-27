'use client';

import { useAuth } from '@/shared/providers/auth/useAuth';
import { Container } from '@/shared/ui/Container';
import { Logo } from '@/shared/ui/Logo';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { Navigation } from '@/widgets/Navigation';

export const Header = () => {
	const { user } = useAuth();

	return (
		<header className='border-b border-gray-200 transition-colors duration-200 dark:border-gray-700'>
			<Container>
				<div className='flex flex-col gap-4 py-4 lg:h-16 lg:flex-row lg:items-center lg:justify-between'>
					<Logo />

					{user && (
						<p className='text-center text-sm text-gray-700 dark:text-gray-300 lg:text-left'>
							{user.email}
						</p>
					)}

					<div className='flex flex-wrap items-center justify-center gap-4 lg:justify-end lg:gap-6'>
						<Navigation />

						<div>
							<ThemeToggle />
						</div>
					</div>
				</div>
			</Container>
		</header>
	);
};
