'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Card, Button, Input } from '@/shared/ui';
import { projectApi } from '@/shared/api/projectApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Project = {
	_id: string;
	title: string;
	description: string;
	owner: string;
	createdAt: string;
	updatedAt: string;
	imageUrl?: string;
	imagePublicId?: string;
};

export default function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchLoading, setSearchLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);

		return () => clearTimeout(timer);
	}, [search]);

	const router = useRouter();

	useEffect(() => {
		const loadProjects = async () => {
			try {
				setSearchLoading(true);

				const data = await projectApi.getAll(debouncedSearch);

				setProjects(data.projects);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
				setSearchLoading(false);
			}
		};

		loadProjects();
	}, [debouncedSearch]);

	const handleDelete = async (id: string) => {
		const confirmed = window.confirm(
			'Are you sure you want to delete this project?',
		);

		if (!confirmed) {
			return;
		}

		try {
			await projectApi.delete(id);

			setProjects((prev) => prev.filter((project) => project._id !== id));
		} catch (error) {
			console.error(error);
		}
	};

	if (loading) {
		return (
			<ProtectedRoute>
				<p>Loading...</p>
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
							onChange={(e) => setSearch(e.target.value)}
							className='max-w-xl'
						/>

						<div className='flex h-16 items-center justify-center mt-2'>
							{searchLoading && (
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
		</ProtectedRoute>
	);
}
