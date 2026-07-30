import type { Metadata } from 'next';
import DashboardPage from './DashboardPage';

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Roman-FreelanceHub dashboard',
};

export default function Page() {
	return <DashboardPage />;
}
