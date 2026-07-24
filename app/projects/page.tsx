'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Card, Button, Input } from '@/shared/ui';
import { projectApi } from '@/shared/api/projectApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// type Project = {
// 	_id: string;
// 	title: string;
// 	description: string;
// 	owner: string;
// 	createdAt: string;
// 	updatedAt: string;
// 	imageUrl?: string;
// 	imagePublicId?: string;
// };

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

	if (isLoading) {
		return (
			<ProtectedRoute>
				<p>Loading...</p>
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
			<div className='mx-auto mt-10 max-w-3xl space-y-6'>
				<h1 className='text-3xl font-bold'>Projects</h1>

				<div className='flex items-start gap-4'>
					<div className='flex-1'>
						<Input
							type='text'
							placeholder='Search projects...'
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setCurrentPage(1);
							}}
							className='max-w-xl'
						/>

						<div className='mt-2 flex h-16 items-center justify-center'>
							{isLoading && (
								<div className='h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-blue-600' />
							)}
						</div>
					</div>

					<Button
						onClick={() => router.push('/projects/create')}
						className='shrink-0'
					>
						Create Project
					</Button>
				</div>

				{projects.length === 0 ? (
					<p>No projects found.</p>
				) : (
					projects.map((project) => (
						<Card key={project._id}>
							<h2 className='text-xl font-semibold'>
								{project.title}
							</h2>

							{project.imageUrl && (
								<Image
									src={project.imageUrl}
									alt={project.title}
									width={600}
									height={300}
									loading='eager'
									className='mb-4 h-48 w-full rounded-lg object-cover'
								/>
							)}

							<p className='mt-2 text-gray-600'>
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
									onClick={() => handleDelete(project._id)}
									className='bg-red-600 hover:bg-red-700'
								>
									Delete
								</Button>
							</div>
						</Card>
					))
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
