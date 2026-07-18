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
		return <p>Loading...</p>;
	}

	if (!user) {
		return null;
	}

	return <>{children}</>;
};
