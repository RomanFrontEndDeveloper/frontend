'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import toast from 'react-hot-toast';

import { projectApi } from '@/shared/api/projectApi';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Button, Card, Input, PageLoader } from '@/shared/ui';

export default function EditProjectPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState<File>();
	const [preview, setPreview] = useState<string | null>(null);

	const { data, isLoading, error } = useQuery({
		queryKey: ['project', params.id],
		queryFn: () => projectApi.getById(params.id),
	});

	useEffect(() => {
		if (!data) return;

		setTitle(data.project.title);
		setDescription(data.project.description);
	}, [data]);

	useEffect(() => {
		return () => {
			if (preview) {
				URL.revokeObjectURL(preview);
			}
		};
	}, [preview]);

	const updateProjectMutation = useMutation({
		mutationFn: (data: {
			title: string;
			description: string;
			image?: File;
		}) => projectApi.update(params.id, data),

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['projects'] }),
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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

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

	if (error || !data) {
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

					<form onSubmit={handleSubmit} className='space-y-6'>
						<label className='group relative block cursor-pointer overflow-hidden rounded-xl'>
							<input
								type='file'
								accept='image/*'
								className='hidden'
								onChange={(e) => {
									const file = e.target.files?.[0];

									if (!file) return;

									setImage(file);

									if (preview) {
										URL.revokeObjectURL(preview);
									}

									setPreview(URL.createObjectURL(file));
								}}
							/>

							<Image
								src={preview || data.project.imageUrl}
								alt={title}
								width={900}
								height={500}
								priority
								className='h-56 w-full rounded-xl object-cover transition duration-300 group-hover:scale-105'
							/>

							<div className='absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/50'>
								<div className='translate-y-3 rounded-lg bg-slate-900/90 px-5 py-3 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
									📷 Change image
								</div>
							</div>
						</label>

						{image && (
							<p className='text-center text-sm font-medium text-cyan-400'>
								Selected: {image.name}
							</p>
						)}

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

						<div className='mt-8 flex gap-4'>
							<Button
								type='button'
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
