'use client';

import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';
import { useAuth } from '@/shared/providers/auth/useAuth';
import { Card, Divider } from '@/shared/ui';

export default function ProfilePage() {
	const { user } = useAuth();

	return (
		<ProtectedRoute>
			<Card className='mx-auto mt-10 max-w-xl p-6'>
				<h1 className='text-3xl font-bold'>Profile</h1>

				<Divider className='my-6' />

				<div className='space-y-4'>
					<p>
						<strong>Email:</strong> {user?.email}
					</p>

					<p>
						<strong>ID:</strong>{' '}
						<span title={user?.id}>
							{user?.id ? `${user.id.slice(0, 8)}...` : '-'}
						</span>
					</p>

					<p>
						<strong>Created at:</strong>{' '}
						{user?.createdAt
							? new Date(user.createdAt).toLocaleDateString(
									'uk-UA',
								)
							: '-'}
					</p>

					<p>
						<strong>Last update:</strong>{' '}
						{user?.updatedAt
							? new Date(user.updatedAt).toLocaleDateString(
									'uk-UA',
								)
							: '-'}
					</p>
				</div>
			</Card>
		</ProtectedRoute>
	);
}
