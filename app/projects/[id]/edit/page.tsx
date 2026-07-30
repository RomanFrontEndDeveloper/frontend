'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '@/shared/api/projectApi';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Button, Card, Input, PageLoader } from '@/shared/ui';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function EditProjectPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState<File | undefined>();

	const updateProjectMutation = useMutation({
		mutationFn: (data: {
			title: string;
			description: string;
			image?: File;
		}) => projectApi.update(params.id as string, data),

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['projects'],
				}),
				queryClient.invalidateQueries({
					queryKey: ['project', params.id],
				}),
				queryClient.invalidateQueries({
					queryKey: ['projects-dashboard'],
				}),
				queryClient.invalidateQueries({
					queryKey: ['dashboard-stats'],
				}),
				queryClient.invalidateQueries({
					queryKey: ['favorites'],
				}),
			]);

			toast.success('Project updated successfully!');

			router.push('/projects');
		},

		onError: () => {
			toast.error('Failed to update project.');
		},
	});

	const { data, isLoading, error } = useQuery({
		queryKey: ['project', params.id],
		queryFn: () => projectApi.getById(params.id),
	});

	useEffect(() => {
		if (!data) return;

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setTitle(data.project.title);

		setDescription(data.project.description);
	}, [data]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		updateProjectMutation.mutate({
			title,
			description,
			image,
		});
	};

	if (isLoading) {
		return (
			<ProtectedRoute>
				<PageLoader />
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
			<div className='mx-auto mt-10 max-w-xl'>
				<Card>
					<h1 className='mb-6 text-3xl font-bold'>Edit Project</h1>

					{data?.project.imageUrl && (
						<div className='mb-6'>
							<Image
								src={data.project.imageUrl}
								alt={`Preview image for ${data.project.title}`}
								width={800}
								height={400}
								sizes='100vw'
								priority
								className='h-48 w-full rounded-lg object-cover'
							/>
						</div>
					)}

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label className='mb-2 block font-medium'>
								Title
							</label>

							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder='Project title'
							/>
						</div>

						<div>
							<label className='mb-2 block font-medium'>
								Description
							</label>

							<Input
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder='Project description'
							/>
						</div>

						<div>
							<label className='mb-2 block font-medium'>
								New image
							</label>

							<input
								type='file'
								accept='image/*'
								onChange={(e) => {
									const file = e.target.files?.[0];

									if (file) {
										setImage(file);
									}
								}}
							/>
						</div>
						<div className='mt-8 flex gap-4'>
							<Button
								variant='secondary'
								className='min-w-32'
								onClick={() => router.back()}
							>
								Back
							</Button>
							<Button
								type='submit'
								className='w-full'
								disabled={updateProjectMutation.isPending}
							>
								{updateProjectMutation.isPending
									? 'Saving...'
									: 'Save changes'}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</ProtectedRoute>
	);
}
