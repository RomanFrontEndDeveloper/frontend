import type { Metadata } from 'next';
import RegisterPage from './RegisterPage';

export const metadata: Metadata = {
	title: 'Register',
	description: 'Create a FreelanceHub account.',
};

export default function Page() {
	return <RegisterPage />;
}
