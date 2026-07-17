'use client';

import { AuthProvider } from './AuthProvider';

type Props = {
	children: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
	return <AuthProvider>{children}</AuthProvider>;
};
