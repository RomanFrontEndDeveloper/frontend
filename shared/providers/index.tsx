'use client';

import { AuthProvider } from './AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

type Props = {
	children: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>{children}</AuthProvider>
		</QueryClientProvider>
	);
};
