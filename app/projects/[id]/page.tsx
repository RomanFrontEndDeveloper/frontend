import type { Metadata } from 'next';
import ProjectPage from './ProjectPage';

export const metadata: Metadata = {
	title: 'Project',
	description: 'Project details',
};

export default function Page() {
	return <ProjectPage />;
}
