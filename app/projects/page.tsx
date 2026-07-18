'use client';

import { ProtectedRoute } from '@/shared/providers/auth/ProtectedRoute';

export default function ProjectsPage() {
	return (
		<ProtectedRoute>
			<section className='py-10'>
				<h1 className='text-4xl font-bold'>Projects</h1>

				<p className='mt-4'>List of freelance projects.</p>
			</section>
		</ProtectedRoute>
	);
}
