'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/shared/providers/auth/useAuth';
import { authApi } from '@/shared/api';
import { loginSchema, type LoginFormData } from '@/shared/validation/auth';
import { Button, Card, Divider, Input, InputError } from '@/shared/ui';

export default function LoginPage() {
	const router = useRouter();
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

			const profile = await authApi.getProfile();

			setUser({
				id: profile.user._id,
				email: profile.user.email,
				createdAt: profile.user.createdAt,
				updatedAt: profile.user.updatedAt,
			});

			console.log('Login successful:', response);

			router.push('/');
		} catch (error) {
			console.error(error);
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
			</Card>
		</section>
	);
}
