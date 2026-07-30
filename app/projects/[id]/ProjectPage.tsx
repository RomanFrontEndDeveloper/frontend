'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { projectApi } from '@/shared/api/projectApi';

import {
	useFavorites,
	useAddFavorite,
	useRemoveFavorite,
} from '@/shared/hooks/useFavorites';

import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';

import { Button, Container, PageLoader, ProjectCard } from '@/shared/ui';

interface Favorite {
	_id: string;
	project: {
		_id: string;
		title: string;
		description: string;
		imageUrl?: string;
	} | null;
}

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
			(favorite: Favorite) =>
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
				<div className='mx-auto my-14 max-w-3xl'>
					<h1 className='mb-10 text-center text-4xl font-bold'>
						Project Details
					</h1>

					<ProjectCard project={project} hideActions>
						<div className='mt-8 rounded-xl border border-border bg-muted/20 p-5'>
							<div className='space-y-4 text-muted-foreground'>
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

								<p className='text-sm'>
									<strong>ID:</strong> {project._id}
								</p>
							</div>
						</div>

						<div className='mt-8 flex flex-col gap-4 sm:flex-row'>
							<Button
								className='flex-1'
								onClick={() =>
									router.push(`/projects/${project._id}/edit`)
								}
							>
								Edit Project
							</Button>

							<Button
								variant='secondary'
								className='flex-1'
								onClick={() => router.back()}
							>
								Back
							</Button>

							<Button
								variant='secondary'
								className='flex-1'
								onClick={handleFavorite}
							>
								{isFavorite
									? '💖 Remove Favorite'
									: '🤍 Add Favorite'}
							</Button>
						</div>
					</ProjectCard>
				</div>
			</Container>
		</ProtectedRoute>
	);
}
