import { Container } from '@/shared/ui/Container';
import { Logo } from '@/shared/ui/Logo';
import { Navigation } from '@/widgets/Navigation';

export const Header = () => {
	return (
		<header className='border-b'>
			<Container>
				<div className='flex h-16 items-center justify-between'>
					<Logo />

					<Navigation />
				</div>
			</Container>
		</header>
	);
};
