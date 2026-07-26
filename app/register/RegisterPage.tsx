'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api';

import {
	registerSchema,
	type RegisterFormData,
} from '@/shared/validation/auth';

import { Button, Card, Divider, Input, InputError } from '@/shared/ui';

export default function RegisterPage() {
	const router = useRouter();

	const registerMutation = useMutation({
		mutationFn: authApi.register,

		onSuccess: () => {
			router.push('/login');
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = (data: RegisterFormData) => {
		registerMutation.mutate(data);
	};

	return (
		<section className='flex flex-1 items-center justify-center py-20'>
			<Card className='w-full max-w-md'>
				<h1 className='text-3xl font-bold text-gray-900'>Register</h1>

				<p className='mt-2 text-gray-500'>
					Create your FreelanceHub account.
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
						disabled={registerMutation.isPending}
					>
						{registerMutation.isPending
							? 'Creating...'
							: 'Create account'}
					</Button>
				</form>

				<p className='mt-6 text-center text-sm text-gray-500'>
					Already have an account?{' '}
					<Link
						href='/login'
						className='font-medium text-blue-600 hover:underline'
					>
						Sign In
					</Link>
				</p>
			</Card>
		</section>
	);
}
