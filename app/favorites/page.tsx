'use client';

import Link from 'next/link';

import { useFavorites } from '@/shared/hooks/useFavorites';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Card, Container } from '@/shared/ui';
import { PageLoader } from '@/shared/ui';

export default function FavoritesPage() {
	const { data, isLoading } = useFavorites();

	if (isLoading) {
		return (
			<ProtectedRoute>
				<PageLoader />
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute>
			<Container>
				<div className='mx-auto my-10 max-w-5xl'>
					<h1 className='mb-8 text-4xl font-bold'>My Favorites</h1>

					<div className='grid gap-6'>
						{data?.favorites?.map((favorite: any) => (
							<Card key={favorite._id} className='space-y-4'>
								<h2 className='text-2xl font-bold'>
									{favorite.project.title}
								</h2>

								<p className='text-gray-600'>
									{favorite.project.description}
								</p>

								<Link
									href={`/projects/${favorite.project._id}`}
									className='text-blue-600 hover:underline'
								>
									Open project →
								</Link>
							</Card>
						))}

						{data?.favorites?.length === 0 && (
							<p className='text-center text-gray-500'>
								No favorite projects yet.
							</p>
						)}
					</div>
				</div>
			</Container>
		</ProtectedRoute>
	);
}
