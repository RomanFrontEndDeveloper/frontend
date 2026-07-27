'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
	useFavorites,
	useAddFavorite,
	useRemoveFavorite,
} from '@/shared/hooks/useFavorites';
import { projectApi } from '@/shared/api/projectApi';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Button, Card, Container, PageLoader } from '@/shared/ui';

export default function ProjectPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();

	const { data, isLoading, error } = useQuery({
		queryKey: ['project', params.id],
		queryFn: () => projectApi.getById(params.id),
	});

	const { data: favoritesData } = useFavorites();

	const addFavorite = useAddFavorite();
	const removeFavorite = useRemoveFavorite();

	if (isLoading) {
		return (
			<ProtectedRoute>
				<PageLoader />
			</ProtectedRoute>
		);
	}

	if (error || !data?.project) {
		return (
			<ProtectedRoute>
				<div className='flex min-h-[calc(100vh-64px)] items-center justify-center'>
					<p className='text-5xl font-bold'>Project not found</p>
				</div>
			</ProtectedRoute>
		);
	}

	const project = data.project;

	const isFavorite =
		favoritesData?.favorites?.some(
			(favorite: any) =>
				favorite.project && favorite.project._id === project._id,
		) ?? false;

	const handleFavorite = () => {
		if (isFavorite) {
			removeFavorite.mutate(project._id);
		} else {
			addFavorite.mutate(project._id);
		}
	};

	return (
		<ProtectedRoute>
			<Container>
				<div className='mx-auto my-10 max-w-5xl'>
					<h1 className='mb-8 text-center text-4xl font-bold'>
						Project Details
					</h1>
					<Card className='p-6'>
						{project.imageUrl && (
							<Image
								src={project.imageUrl}
								alt={project.title}
								width={900}
								height={500}
								className='mb-6 h-[350px] w-full rounded-xl object-cover'
							/>
						)}

						<h1 className='mb-4 text-4xl font-bold'>
							{project.title}
						</h1>

						<p className='mb-8 text-lg text-gray-600'>
							{project.description}
						</p>

						<div className='space-y-3 text-gray-600'>
							<p>
								<strong>Created:</strong>{' '}
								{new Date(
									project.createdAt,
								).toLocaleDateString()}
							</p>

							<p>
								<strong>Updated:</strong>{' '}
								{new Date(
									project.updatedAt,
								).toLocaleDateString()}
							</p>
							<p className='mt-4 text-sm text-gray-500'>
								ID: {project._id}
							</p>
						</div>

						<div className='mt-8 flex gap-4'>
							<Button
								className='min-w-40'
								onClick={() =>
									router.push(`/projects/${project._id}/edit`)
								}
							>
								Edit Project
							</Button>

							<Button
								variant='secondary'
								className='min-w-32'
								onClick={() => router.back()}
							>
								Back
							</Button>
							<Button
								variant='secondary'
								className='min-w-44'
								onClick={handleFavorite}
							>
								{isFavorite
									? '💖 Remove Favorite'
									: '🤍 Add Favorite'}
							</Button>
						</div>
					</Card>
				</div>
			</Container>
		</ProtectedRoute>
	);
}
