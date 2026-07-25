'use client';

import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/shared/api';
import { projectApi } from '@/shared/api/projectApi';
import { Card, Button, Container } from '@/shared/ui';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {
		data: profileData,
		isLoading: profileLoading,
		error: profileError,
	} = useQuery({
		queryKey: ['profile'],
		queryFn: authApi.getProfile,
	});

	const {
		data: projectsData,
		isLoading: projectsLoading,
		error: projectsError,
	} = useQuery({
		queryKey: ['projects-dashboard'],
		queryFn: () => projectApi.getAll(),
	});

	const deleteProjectMutation = useMutation({
		mutationFn: (id: string) => projectApi.delete(id),

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['projects'],
				}),
				queryClient.invalidateQueries({
					queryKey: ['projects-dashboard'],
				}),
			]);
		},
	});

	const latestProject = projectsData?.projects[0];

	const lastUpdate = latestProject
		? new Date(latestProject.updatedAt).toLocaleDateString()
		: '-';

	if (profileLoading || projectsLoading) {
		return (
			<ProtectedRoute>
				<div className='flex min-h-[calc(100vh-64px)] items-center justify-center'>
					<p className='text-5xl font-bold'>Loading...</p>
				</div>
			</ProtectedRoute>
		);
	}

	if (profileError || projectsError) {
		return (
			<ProtectedRoute>
				<div className='flex min-h-[calc(100vh-64px)] items-center justify-center'>
					<p className='text-5xl font-bold'>Something went wrong.</p>
				</div>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute>
			<Container>
				<div className='mt-8 mx-auto max-w-6xl'>
					<h2 className='mb-4 text-2xl font-bold'>Quick Actions</h2>

					<div className='flex flex-wrap gap-4'>
						<Button onClick={() => router.push('/projects/create')}>
							Create Project
						</Button>

						<Button
							variant='secondary'
							onClick={() => router.push('/projects')}
						>
							View Projects
						</Button>

						<Button
							variant='secondary'
							onClick={() => router.push('/profile')}
						>
							Profile
						</Button>
					</div>
				</div>

				<div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4 mt-10'>
					<Card>
						<h2 className='mb-2 text-xl font-semibold'>User</h2>

						<p>{profileData?.user.email}</p>
					</Card>

					<Card>
						<h2 className='mb-2 text-xl font-semibold'>Projects</h2>

						<p className='text-4xl font-bold'>
							{projectsData?.totalProjects}
						</p>
					</Card>

					<Card>
						<h2 className='mb-2 text-xl font-semibold'>
							Last Project
						</h2>

						<p className='truncate'>
							{latestProject?.title ?? '-'}
						</p>
					</Card>

					<Card>
						<h2 className='mb-2 text-xl font-semibold'>
							Last Update
						</h2>

						<p>{lastUpdate}</p>
					</Card>
				</div>

				<div className='mt-10'>
					<h2 className='mb-6 text-center text-3xl font-bold'>
						Recent Projects
					</h2>

					{projectsData?.projects.length === 0 ? (
						<Card className='py-10 text-center'>
							<p className='text-lg text-gray-500'>
								You don't have any projects yet.
							</p>
						</Card>
					) : (
						<div className='mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
							{projectsData?.projects.map((project) => (
								<Card
									key={project._id}
									className='rounded-xl border border-gray-200 p-5 transition-shadow duration-300 hover:shadow-xl'
								>
									<div className='flex h-full flex-col'>
										{project.imageUrl && (
											<Image
												src={project.imageUrl}
												alt={project.title}
												width={400}
												height={160}
												className='mb-4 h-40 w-full rounded-lg object-cover'
											/>
										)}

										<h3 className='text-2xl font-bold'>
											{project.title}
										</h3>

										<p className='mt-3 line-clamp-3 flex-1 text-gray-600'>
											{project.description}
										</p>

										<p className='mt-4 text-sm text-gray-500'>
											Created:{' '}
											{new Date(
												project.createdAt,
											).toLocaleDateString()}
										</p>

										<div className='mt-6 grid grid-cols-3 gap-3'>
											<Button
												variant='secondary'
												onClick={() =>
													router.push(
														`/projects/${project._id}`,
													)
												}
											>
												View
											</Button>
											<Button
												className='flex-1'
												onClick={() =>
													router.push(
														`/projects/${project._id}/edit`,
													)
												}
											>
												Edit
											</Button>

											<Button
												className='flex-1 bg-red-600 hover:bg-red-700'
												disabled={
													deleteProjectMutation.isPending
												}
												onClick={() => {
													const confirmed =
														window.confirm(
															'Delete this project?',
														);

													if (!confirmed) {
														return;
													}

													deleteProjectMutation.mutate(
														project._id,
													);
												}}
											>
												{deleteProjectMutation.isPending
													? 'Deleting...'
													: 'Delete'}
											</Button>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</Container>
		</ProtectedRoute>
	);
}
