'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useFavorites, useRemoveFavorite } from '@/shared/hooks/useFavorites';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Button, Card, Container, PageLoader, AnimatedCard } from '@/shared/ui';

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
									<AnimatedCard
										key={favorite._id}
										delay={index * 0.08}
									>
										<Card className='flex h-full flex-col rounded-xl border border-border p-6'>
											<h2 className='break-words text-2xl font-bold'>
												{favorite.project.title}
											</h2>

											{favorite.project.imageUrl && (
												<Image
													src={
														favorite.project
															.imageUrl
													}
													alt={favorite.project.title}
													width={600}
													height={300}
													className='my-4 h-56 w-full rounded-xl object-cover'
												/>
											)}

											<p className='flex-1 text-muted-foreground'>
												{favorite.project.description}
											</p>

											<div className='mt-6 flex flex-col items-center gap-3'>
												<Link
													href={`/projects/${favorite.project._id}`}
													className='flex w-full justify-center'
												>
													<Button
														variant='secondary'
														className='w-4/5'
													>
														View Project
													</Button>
												</Link>

												<Button
													type='button'
													className='w-4/5 bg-red-600 hover:bg-red-700'
													onClick={() =>
														removeFavorite.mutate(
															favorite.project
																._id,
														)
													}
												>
													💖 Remove Favorite
												</Button>
											</div>
										</Card>
									</AnimatedCard>
								),
							)}
						</div>
					)}
				</div>
			</Container>
		</ProtectedRoute>
	);
}
