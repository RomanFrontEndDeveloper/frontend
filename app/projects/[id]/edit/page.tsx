'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { projectApi } from '@/shared/api/projectApi';
import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { Button, Card, Input } from '@/shared/ui';

export default function EditProjectPage() {
	const params = useParams();
	const router = useRouter();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const loadProject = async () => {
			try {
				const data = await projectApi.getById(params.id as string);

				setTitle(data.project.title);
				setDescription(data.project.description);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		loadProject();
	}, [params.id]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			setSaving(true);

			await projectApi.update(params.id as string, {
				title,
				description,
			});

			router.push('/projects');
		} catch (error) {
			console.error(error);
		} finally {
			setSaving(false);
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
			<div className='mx-auto mt-10 max-w-xl'>
				<Card>
					<h1 className='mb-6 text-3xl font-bold'>Edit Project</h1>

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

						<Button
							type='submit'
							className='w-full'
							disabled={saving}
						>
							{saving ? 'Saving...' : 'Save changes'}
						</Button>
					</form>
				</Card>
			</div>
		</ProtectedRoute>
	);
}
