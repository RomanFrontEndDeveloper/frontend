'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/shared/providers/auth/useAuth';

export const Navigation = () => {
	const pathname = usePathname();
	const { user, logout } = useAuth();

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/about', label: 'About' },
	];

	return (
		<nav>
			<ul className='flex items-center gap-8'>
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
