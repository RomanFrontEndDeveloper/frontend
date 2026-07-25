'use client';

import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
	children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: Props) => {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push('/login');
		}
	}, [loading, user, router]);

	if (loading) {
		return (
			<div className='flex min-h-screen items-center justify-center'>
				<p className='text-6xl font-bold'>Loading...</p>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return <>{children}</>;
};
