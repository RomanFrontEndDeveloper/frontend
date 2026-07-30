import type { Metadata } from 'next';
import LoginPage from './LoginPage';

export const metadata: Metadata = {
	title: 'Login',
	description: 'Sign in to your Roman-FreelanceHub account.',
};
export default function Page() {
	return <LoginPage />;
}
