'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { projectApi } from '@/shared/api/projectApi';
import { Button, Card, Divider, Input } from '@/shared/ui';
import {
	createProjectSchema,
	CreateProjectFormData,
} from '@/shared/validation/project';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function CreateProjectPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateProjectFormData>({
		resolver: zodResolver(createProjectSchema),
	});

	const router = useRouter();
	const queryClient = useQueryClient();

	const [image, setImage] = useState<File | null>(null);

	const createProjectMutation = useMutation({
		mutationFn: projectApi.create,

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ['projects'],
				}),
				queryClient.invalidateQueries({
					queryKey: ['projects-dashboard'],
				}),
				queryClient.invalidateQueries({
					queryKey: ['dashboard-stats'],
				}),
			]);

			toast.success('Project created successfully!');

			router.push('/projects');
		},

		onError: () => {
			toast.error('Failed to create project.');
		},
	});

	const onSubmit = (data: CreateProjectFormData) => {
		createProjectMutation.mutate({
			...data,
			image,
		});
	};

	return (
		<Card className='mx-auto mt-10 max-w-xl p-6'>
			<h1 className='text-3xl font-bold'>Create Project</h1>

			<Divider className='my-6' />

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div>
					<label htmlFor='title' className='mb-2 block font-medium'>
						Title
					</label>

					<Input
						id='title'
						placeholder='Enter project title'
						error={!!errors.title}
						{...register('title')}
					/>

					{errors.title && (
						<p className='mt-1 text-sm text-red-500'>
							{errors.title.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor='description'
						className='mb-2 block font-medium'
					>
						Description
					</label>

					<Input
						id='description'
						placeholder='Enter project description'
						error={!!errors.description}
						{...register('description')}
					/>

					{errors.description && (
						<p className='mt-1 text-sm text-red-500'>
							{errors.description.message}
						</p>
					)}
				</div>

				<div>
					<label htmlFor='image' className='mb-2 block font-medium'>
						Project Image
					</label>

					<Input
						id='image'
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
						className='w-full'
						type='submit'
						disabled={createProjectMutation.isPending}
					>
						{createProjectMutation.isPending
							? 'Creating...'
							: 'Create Project'}
					</Button>
				</div>
			</form>
		</Card>
	);
}
