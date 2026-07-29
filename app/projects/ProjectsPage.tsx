'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import {
	Button,
	Input,
	Modal,
	ProjectCard,
	Skeleton,
	SkeletonCard,
} from '@/shared/ui';
import { projectApi } from '@/shared/api/projectApi';
import { useRouter } from 'next/navigation';
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

	const favoriteIds = new Set(
		favoritesData?.favorites
			?.map((favorite: Favorite) => favorite.project?._id)
			.filter((id: string | null | undefined): id is string =>
				Boolean(id),
			),
	);

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
						{projects.map((project, index) => (
							<ProjectCard
								key={project._id}
								project={project}
								delay={index * 0.08}
								showFavoriteButton
								isFavorite={favoriteIds.has(project._id)}
								onFavorite={handleFavorite}
								onDelete={handleDelete}
								onView={(id) => router.push(`/projects/${id}`)}
								onEdit={(id) =>
									router.push(`/projects/${id}/edit`)
								}
							/>
						))}
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
