'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Card, Button, Input } from '@/shared/ui';
import { projectApi } from '@/shared/api/projectApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Skeleton, SkeletonCard } from '@/shared/ui';

export default function ProjectsPage() {
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(1);

	const limit = 3;

	const router = useRouter();
	const queryClient = useQueryClient();

	const deleteProjectMutation = useMutation({
		mutationFn: (id: string) => projectApi.delete(id),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['projects'],
			});
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
		const confirmed = window.confirm(
			'Are you sure you want to delete this project?',
		);

		if (!confirmed) {
			return;
		}

		deleteProjectMutation.mutate(id);
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
						className='w-1/2 md:w-auto'
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
						{projects.map((project) => (
							<Card
								key={project._id}
								className='flex h-full flex-col rounded-xl border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
							>
								<h2 className='text-2xl font-bold break-words'>
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

								<p className='flex-1 text-muted-foreground line-clamp-3'>
									{project.description}
								</p>

								<div className='mt-4 flex gap-3'>
									<Link
										href={`/projects/${project._id}/edit`}
										className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
									>
										Edit
									</Link>

									<Button
										type='button'
										onClick={() =>
											handleDelete(project._id)
										}
										className='bg-red-600 hover:bg-red-700'
									>
										Delete
									</Button>
								</div>
							</Card>
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
		</ProtectedRoute>
	);
}
