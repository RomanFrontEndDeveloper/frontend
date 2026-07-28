'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

import { authApi } from '@/shared/api';
import { useAuth } from '@/shared/providers/auth/useAuth';
import { loginSchema, type LoginFormData } from '@/shared/validation/auth';
import { Button, Card, Divider, Input, InputError } from '@/shared/ui';

export default function LoginPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { setUser } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			const response = await authApi.login(data);

			localStorage.setItem('token', response.token);

			// Очистити кеш попереднього користувача
			queryClient.clear();

			const profile = await authApi.getProfile();

			setUser({
				id: profile.user._id,
				email: profile.user.email,
				createdAt: profile.user.createdAt,
				updatedAt: profile.user.updatedAt,
			});

			toast.success('Login successful!');

			router.push('/dashboard');
		} catch (error: unknown) {
			console.error(error);

			if (axios.isAxiosError(error)) {
				toast.error(
					error.response?.data?.message ?? 'Something went wrong',
				);
			} else {
				toast.error('Something went wrong');
			}
		}
	};

	return (
		<section className='flex flex-1 items-center justify-center py-20'>
			<Card className='w-full max-w-md'>
				<h1 className='text-3xl font-bold text-gray-900'>Login</h1>

				<p className='mt-2 text-gray-500'>
					Welcome back to FreelanceHub.
				</p>

				<Divider className='my-6' />

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div>
						<Input
							type='email'
							placeholder='Email'
							error={!!errors.email}
							{...register('email')}
						/>

						<InputError message={errors.email?.message} />
					</div>

					<div>
						<Input
							type='password'
							placeholder='Password'
							error={!!errors.password}
							{...register('password')}
						/>

						<InputError message={errors.password?.message} />
					</div>

					<Button
						type='submit'
						className='w-full'
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Signing In...' : 'Sign In'}
					</Button>
				</form>

				<p className='mt-6 text-center text-sm text-gray-500'>
					Do not have an account?{' '}
					<Link
						href='/register'
						className='font-medium text-blue-600 hover:underline'
					>
						Register
					</Link>
				</p>
			</Card>
		</section>
	);
}
