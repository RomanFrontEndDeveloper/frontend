'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { projectApi } from '@/shared/api/projectApi';
import { Button, Card, Divider, Input } from '@/shared/ui';
import {
	createProjectSchema,
	CreateProjectFormData,
} from '@/shared/validation/project';

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
	const [preview, setPreview] = useState<string | null>(null);

	useEffect(() => {
		return () => {
			if (preview) {
				URL.revokeObjectURL(preview);
			}
		};
	}, [preview]);

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

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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

					{preview ? (
						<>
							<Image
								src={preview}
								alt='Preview'
								width={900}
								height={500}
								className='h-56 w-full rounded-xl object-cover transition duration-300 group-hover:scale-105'
							/>

							<div className='absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/50'>
								<div className='translate-y-3 rounded-lg bg-slate-900/90 px-5 py-3 text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
									📷 Change image
								</div>
							</div>
						</>
					) : (
						<div className='flex h-56 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-800/40 transition hover:border-blue-500 hover:bg-slate-800'>
							<div className='text-6xl'>🖼️</div>

							<p className='mt-4 text-lg font-semibold'>
								Choose project image
							</p>

							<p className='mt-2 text-sm text-slate-400'>
								PNG, JPG or WEBP
							</p>
						</div>
					)}
				</label>

				{image && (
					<p className='text-center text-sm font-medium text-cyan-400'>
						Selected: {image.name}
					</p>
				)}

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
