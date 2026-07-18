'use client';

import { useEffect, useState } from 'react';
import { authApi } from '@/shared/api';
import { AuthContext, User } from './auth/AuthContext';

type Props = {
	children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
	};

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem('token');

			if (!token) {
				setLoading(false);
				return;
			}

			try {
				const profile = await authApi.getProfile();

				setUser({
					id: profile.user._id,
					email: profile.user.email,
					createdAt: profile.user.createdAt,
					updatedAt: profile.user.updatedAt,
				});
			} catch (error) {
				console.error('Authentication failed:', error);

				localStorage.removeItem('token');
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				loading,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
