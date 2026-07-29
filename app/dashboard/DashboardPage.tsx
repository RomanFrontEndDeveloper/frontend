'use client';

import { useState } from 'react';
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
	ProjectCard,
} from '@/shared/ui';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const Modal = dynamic(() =>
	import('@/shared/ui/Modal').then((mod) => ({
		default: mod.Modal,
	})),
);

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

				<div className='mt-10 grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4'>
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
							<Card className='flex min-h-28 flex-col p-3 sm:min-h-32 sm:p-5'>
								<h2 className='mb-1 text-sm font-semibold sm:text-xl'>
									{item.title}
								</h2>

								<p
									className={
										item.title === 'Projects'
											? 'text-2xl font-bold sm:text-4xl'
											: item.title === 'Last Project'
												? 'truncate text-sm sm:text-base'
												: 'text-xs sm:text-base'
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
								<ProjectCard
									key={project._id}
									project={project}
									delay={index * 0.08}
									onDelete={handleDelete}
									onView={(id) =>
										router.push(`/projects/${id}`)
									}
									onEdit={(id) =>
										router.push(`/projects/${id}/edit`)
									}
								/>
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
