'use client';

import { Container } from '@/shared/ui/Container';
import { Logo } from '@/shared/ui/Logo';
import { Navigation } from '@/widgets/Navigation';
import { useAuth } from '@/shared/providers/auth/useAuth';

export const Header = () => {
	const { user } = useAuth();
	return (
		<header className='border-b'>
			<Container>
				<div className='flex h-16 items-center justify-between'>
					<Logo />
					{user && <span>{user.email}</span>}
					<Navigation />
				</div>
			</Container>
		</header>
	);
};
