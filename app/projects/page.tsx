import type { Metadata } from 'next';
import ProjectsPage from './ProjectsPage';

export const metadata: Metadata = {
	title: 'Projects',
	description: 'Browse freelance projects.',
};

export default function Page() {
	return <ProjectsPage />;
}
