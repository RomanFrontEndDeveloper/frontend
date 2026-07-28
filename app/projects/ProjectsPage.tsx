'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Card, Button, Input, AnimatedCard, Modal } from '@/shared/ui';
import { projectApi } from '@/shared/api/projectApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Skeleton, SkeletonCard } from '@/shared/ui';
import {
	useFavorites,
	useAddFavorite,
	useRemoveFavorite,
} from '@/shared/hooks/useFavorites';
import toast from 'react-hot-toast';

interface Favorite {
	_id: string;
	project: {
		_id: string;
		title: string;
		description: string;
		imageUrl?: string;
	} | null;
}

export default function ProjectsPage() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

	const limit = 3;

	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: favoritesData } = useFavorites();

	const addFavorite = useAddFavorite();

	const removeFavorite = useRemoveFavorite();

	const handleFavorite = (projectId: string, isFavorite: boolean) => {
		if (isFavorite) {
			removeFavorite.mutate(projectId);
		} else {
			addFavorite.mutate(projectId);
		}
	};

	const deleteProjectMutation = useMutation({
		mutationFn: (id: string) => projectApi.delete(id),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['projects'],
			});

			queryClient.invalidateQueries({
				queryKey: ['favorites'],
			});

			queryClient.invalidateQueries({
				queryKey: ['dashboard-stats'],
			});

			toast.success('Project deleted successfully!');
		},

		onError: () => {
			toast.error('Failed to delete project.');
		},
	});

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);

		return () => clearTimeout(timer);
	}, [search]);

	const { data, isLoading, error } = useQuery({
		queryKey: ['projects', debouncedSearch, currentPage],
		queryFn: () => projectApi.getAll(debouncedSearch, currentPage, limit),
		placeholderData: (previousData) => previousData,
	});

	const projects = data?.projects ?? [];
	const totalPages = data?.totalPages ?? 1;

	const handleDelete = (id: string) => {
		setProjectToDelete(id);
		setIsModalOpen(true);
	};

	const confirmDelete = () => {
		if (!projectToDelete) {
			return;
		}

		deleteProjectMutation.mutate(projectToDelete);

		setProjectToDelete(null);
		setIsModalOpen(false);
	};

	const closeModal = () => {
		setProjectToDelete(null);
		setIsModalOpen(false);
	};

	if (isLoading && !data) {
		return (
			<ProtectedRoute>
				<div className='mx-auto mt-10 max-w-screen-2xl space-y-8 px-4 sm:px-6 lg:px-8'>
					<Skeleton className='h-10 w-56' />

					<div className='flex flex-col items-center gap-4 md:flex-row md:justify-between'>
						<Skeleton className='h-12 w-[70%] md:w-1/2' />
						<Skeleton className='h-12 w-[50%] md:w-40' />
					</div>

					<div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
						{Array.from({ length: 3 }).map((_, index) => (
							<SkeletonCard key={index} />
						))}
					</div>
				</div>
			</ProtectedRoute>
		);
	}

	if (error) {
		return (
			<ProtectedRoute>
				<p>Something went wrong.</p>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute>
			<div className='mx-auto mt-10 max-w-screen-2xl space-y-8 px-4 sm:px-6  lg:px-8'>
				<h1 className='text-3xl font-bold'>Projects</h1>
				<div className='flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-start'>
					<div className='w-[70%] md:w-1/2'>
						<Input
							type='text'
							placeholder='Search projects...'
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setCurrentPage(1);
							}}
							className='w-full'
						/>
					</div>

					<Button
						onClick={() => router.push('/projects/create')}
						className='w-3xs'
					>
						Create Project
					</Button>
				</div>

				{projects.length === 0 ? (
					<div className='flex items-center justify-center py-20'>
						<p className='text-4xl font-bold text-center'>
							No projects found.
						</p>
					</div>
				) : (
					<div className='grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
						{projects.map((project, index) => {
							const isFavorite =
								favoritesData?.favorites?.some(
									(favorite: Favorite) =>
										favorite.project?._id === project._id,
								) ?? false;

							return (
								<AnimatedCard
									key={project._id}
									delay={index * 0.08}
								>
									<Card className='flex h-full flex-col rounded-xl border border-border p-6'>
										<h2 className='break-words text-2xl font-bold'>
											{project.title}
										</h2>

										{project.imageUrl && (
											<Image
												src={project.imageUrl}
												alt={project.title}
												width={600}
												height={300}
												className='my-4 h-56 w-full rounded-xl object-cover'
											/>
										)}

										<p className='flex-1 line-clamp-3 text-muted-foreground'>
											{project.description}
										</p>

										<div className='mt-6 space-y-3'>
											<div className='grid grid-cols-3 gap-3'>
												<Link
													href={`/projects/${project._id}/edit`}
													className='flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700'
												>
													Edit
												</Link>

												<Button
													variant='secondary'
													className='w-full'
													onClick={() =>
														router.push(
															`/projects/${project._id}`,
														)
													}
												>
													View
												</Button>

												<Button
													type='button'
													className='w-full bg-red-600 hover:bg-red-700'
													onClick={() =>
														handleDelete(
															project._id,
														)
													}
												>
													Delete
												</Button>
											</div>

											<Button
												variant='secondary'
												className='w-full'
												onClick={() =>
													handleFavorite(
														project._id,
														isFavorite,
													)
												}
											>
												{isFavorite
													? '💖 Remove Favorite'
													: '🤍 Add Favorite'}
											</Button>
										</div>
									</Card>
								</AnimatedCard>
							);
						})}
					</div>
				)}
			</div>

			<div className='my-8 flex items-center justify-center gap-4'>
				<Button
					type='button'
					disabled={currentPage === 1}
					onClick={() => setCurrentPage((prev) => prev - 1)}
					className='w-26'
				>
					Previous
				</Button>

				<span className='text-lg font-semibold'>
					Page {currentPage} of {totalPages}
				</span>

				<Button
					type='button'
					disabled={currentPage === totalPages}
					onClick={() => setCurrentPage((prev) => prev + 1)}
					className='w-26'
				>
					Next
				</Button>
			</div>
			<Modal
				isOpen={isModalOpen}
				title='Delete Project'
				onClose={closeModal}
				onConfirm={confirmDelete}
			>
				<p>Are you sure you want to delete this project?</p>
			</Modal>
		</ProtectedRoute>
	);
}
