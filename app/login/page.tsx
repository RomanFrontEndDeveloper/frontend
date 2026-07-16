'use client';

import { Button, Card, Divider, Input, InputError } from '@/shared/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/shared/validation/auth';
import { authApi } from '@/shared/api';

const onSubmit = async (data: LoginFormData) => {
	try {
		const response = await authApi.login(data);

		localStorage.setItem('token', response.token);

		console.log('Login successful:', response);
	} catch (error) {
		console.error(error);
	}
};

export default function LoginPage() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	return (
		<section className='flex flex-1 items-center justify-center py-20'>
			<Card className='w-full max-w-md'>
				<h1 className='text-3xl text-gray-900 font-bold'>Login</h1>

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

					<Button className='w-full' disabled={isSubmitting}>
						{isSubmitting ? 'Signing In...' : 'Sign In'}
					</Button>
				</form>
			</Card>
		</section>
	);
}
