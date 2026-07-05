import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';

export default function Home() {
	return (
		<EmptyState
			title='No projects'
			description='Create your first project.'
		>
			<Button>Create Project</Button>
		</EmptyState>
	);
}
