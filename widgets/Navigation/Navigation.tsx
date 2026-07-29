'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/shared/providers/auth/useAuth';

export const Navigation = () => {
	const pathname = usePathname();
	const { user, logout } = useAuth();

	const links = [
		{ href: '/dashboard', label: 'Dashboard' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/favorites', label: 'Favorites' },
		{ href: '/profile', label: 'Profile' },
	];

	return (
		<nav>
			<ul className='flex flex-wrap items-center justify-center gap-x-6 gap-y-3'>
				{links.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							className={
								pathname === link.href
									? 'font-semibold text-blue-700 hover:text-blue-500'
									: 'text-gray-500 hover:text-gray-300 transition-colors'
							}
						>
							{link.label}
						</Link>
					</li>
				))}

				{user ? (
					<li>
						<button
							onClick={logout}
							className='text-red-500 hover:text-red-400 transition-colors'
						>
							Logout
						</button>
					</li>
				) : (
					<li>
						<Link
							href='/login'
							className='text-blue-500 hover:text-blue-400 transition-colors'
						>
							Login
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
};
