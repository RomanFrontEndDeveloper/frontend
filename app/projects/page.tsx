'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Card, Button } from '@/shared/ui';
import { projectApi } from '@/shared/api/projectApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Project = {
	_id: string;
	title: string;
	description: string;
	owner: string;
	createdAt: string;
	updatedAt: string;
};

export default function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const data = await projectApi.getAll();
				setProjects(data.projects);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		loadProjects();
	}, []);

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
			<div className='mx-auto mt-10 max-w-3xl space-y-4'>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold'>Projects</h1>

					<Button onClick={() => router.push('/projects/create')}>
						Create Project
					</Button>
				</div>

				{projects.length === 0 ? (
					<p>No projects yet.</p>
				) : (
					projects.map((project) => (
						<Card key={project._id}>
							<h2 className='text-xl font-semibold'>
								{project.title}
							</h2>

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
