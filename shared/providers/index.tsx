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
						// Дані вважаються актуальними 5 хвилин
						staleTime: 1000 * 60 * 5,

						// Кеш зберігається 10 хвилин після останнього використання
						gcTime: 1000 * 60 * 10,

						// Не робити повторний запит при поверненні у вкладку
						refetchOnWindowFocus: false,

						// Одна повторна спроба при помилці
						retry: 1,
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
