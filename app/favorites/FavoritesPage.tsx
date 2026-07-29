'use client';

import { useFavorites, useRemoveFavorite } from '@/shared/hooks/useFavorites';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Container, PageLoader, ProjectCard } from '@/shared/ui';
import { useRouter } from 'next/navigation';

interface Favorite {
	_id: string;
	project: {
		_id: string;
		title: string;
		description: string;
		imageUrl?: string;
	};
}

export default function FavoritesPage() {
	const { data, isLoading } = useFavorites();
	const removeFavorite = useRemoveFavorite();
	const router = useRouter();

	if (isLoading) {
		return (
			<ProtectedRoute>
				<PageLoader />
			</ProtectedRoute>
		);
	}

	const favorites =
		data?.favorites?.filter(
			(favorite: Favorite) => favorite.project !== null,
		) ?? [];

	return (
		<ProtectedRoute>
			<Container>
				<div className='mx-auto my-10 max-w-screen-2xl'>
					<h1 className='mb-8 text-4xl font-bold'>My Favorites</h1>

					{favorites.length === 0 ? (
						<div className='flex items-center justify-center py-20'>
							<p className='text-center text-4xl font-bold'>
								No favorite projects yet.
							</p>
						</div>
					) : (
						<div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
							{favorites.map(
								(favorite: Favorite, index: number) => (
									<ProjectCard
										key={favorite._id}
										project={favorite.project}
										delay={index * 0.08}
										removeFavoriteButton
										onView={(id) =>
											router.push(`/projects/${id}`)
										}
										onRemoveFavorite={(id) =>
											removeFavorite.mutate(id)
										}
									/>
								),
							)}
						</div>
					)}
				</div>
			</Container>
		</ProtectedRoute>
	);
}
