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
				<div className='flex flex-col gap-5 py-4 lg:flex-row lg:items-center lg:justify-between'>
					<Logo />

					{user && (
						<p className='text-center break-all text-sm text-gray-700 dark:text-gray-300 lg:text-left'>
							{user.email}
						</p>
					)}

					<div className='flex w-full flex-col items-center gap-4 lg:w-auto lg:flex-row lg:justify-end'>
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
