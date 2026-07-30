import type { Metadata } from 'next';
import ProfilePage from './ProfilePage';

export const metadata: Metadata = {
	title: 'Profile',
	description: 'Manage your Roman-FreelanceHub profile.',
};

export default function Page() {
	return <ProfilePage />;
}
