'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/shared/api';
import { projectApi } from '@/shared/api/projectApi';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useDashboardStats } from '@/shared/hooks/useDashboardStats';
import {
	Button,
	Card,
	Container,
	DashboardSkeleton,
	Modal,
	AnimatedCard,
} from '@/shared/ui';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function DashboardPage() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

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

	const { data, isLoading } = useDashboardStats();

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
				queryClient.invalidateQueries({
					queryKey: ['favorites'],
				}),
				queryClient.invalidateQueries({
					queryKey: ['dashboard-stats'],
				}),
			]);

			toast.success('Project deleted successfully!');
		},

		onError: () => {
			toast.error('Failed to delete project.');
		},
	});

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

	if (profileLoading || projectsLoading || isLoading) {
		return (
			<ProtectedRoute>
				<DashboardSkeleton />
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
				<div className='mb-10 mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3'>
					<div className='flex flex-col gap-4'>
						<h2 className='mb-4 text-2xl font-bold'>
							Quick Actions
						</h2>
						<Button
							className='w-3xs'
							onClick={() => router.push('/projects/create')}
						>
							Create Project
						</Button>
					</div>
				</div>

				<div className='grid gap-6 mt-10 md:grid-cols-2 xl:grid-cols-4'>
					{[
						{
							title: 'User',
							value: profileData?.user.email,
						},
						{
							title: 'Projects',
							value: data?.stats.projectsCount ?? 0,
						},
						{
							title: 'Last Project',
							value: data?.stats.lastProject ?? 'No projects',
						},
						{
							title: 'Last Update',
							value: data?.stats.lastUpdate
								? new Date(
										data.stats.lastUpdate,
									).toLocaleDateString()
								: '-',
						},
					].map((item, index) => (
						<motion.div
							key={item.title}
							initial={{
								opacity: 0,
								scale: 0.92,
							}}
							animate={{
								opacity: 1,
								scale: 1,
							}}
							transition={{
								duration: 0.35,
								delay: index * 0.08,
								ease: 'easeOut',
							}}
							whileHover={{
								scale: 1.03,
								boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
							}}
						>
							<Card className='flex min-h-34 flex-col'>
								<h2 className='mb-2 text-xl font-semibold'>
									{item.title}
								</h2>

								<p
									className={
										item.title === 'Projects'
											? 'text-4xl font-bold'
											: item.title === 'Last Project'
												? 'truncate'
												: ''
									}
								>
									{item.value}
								</p>
							</Card>
						</motion.div>
					))}
				</div>

				<div className='mt-10'>
					<h2 className='mb-6 text-center text-3xl font-bold'>
						Recent Projects
					</h2>

					{projectsData?.projects.length === 0 ? (
						<Card className='py-10 text-center'>
							<p className='text-lg text-gray-500'>
								You don&apos;t have any projects yet.
							</p>
						</Card>
					) : (
						<div className='mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
							{projectsData?.projects.map((project, index) => (
								<AnimatedCard
									key={project._id}
									delay={index * 0.08}
								>
									<Card
										key={project._id}
										className='rounded-xl border border-gray-200 p-5 transition-shadow duration-300'
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
													onClick={() =>
														handleDelete(
															project._id,
														)
													}
												>
													{deleteProjectMutation.isPending
														? 'Deleting...'
														: 'Delete'}
												</Button>
											</div>
										</div>
									</Card>
								</AnimatedCard>
							))}
						</div>
					)}
				</div>
				<Modal
					isOpen={isModalOpen}
					title='Delete Project'
					onClose={closeModal}
					onConfirm={confirmDelete}
				>
					<p>Are you sure you want to delete this project?</p>
				</Modal>
			</Container>
		</ProtectedRoute>
	);
}
