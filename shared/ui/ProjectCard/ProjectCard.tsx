'use client';

import { memo } from 'react';
import Image from 'next/image';
import { AnimatedCard, Button, Card } from '@/shared/ui';
interface Project {
	_id: string;
	title: string;
	description: string;
	imageUrl?: string;
}

interface ProjectCardProps {
	project: Project;

	delay?: number;

	showFavoriteButton?: boolean;
	removeFavoriteButton?: boolean;

	isFavorite?: boolean;

	onFavorite?: (projectId: string, isFavorite: boolean) => void;
	onRemoveFavorite?: (projectId: string) => void;

	onDelete?: (id: string) => void;
	onView?: (id: string) => void;
	onEdit?: (id: string) => void;
}

export const ProjectCard = memo(function ProjectCard({
	project,
	delay = 0,
	showFavoriteButton = false,
	removeFavoriteButton = false,
	isFavorite = false,
	onDelete,
	onFavorite,
	onRemoveFavorite,
	onView,
	onEdit,
}: ProjectCardProps) {
	return (
		<AnimatedCard delay={delay}>
			<Card className='flex h-full flex-col rounded-xl border border-border p-6'>
				<h2 className='break-words text-2xl font-bold'>
					{project.title}
				</h2>

				{project.imageUrl && (
					<Image
						src={project.imageUrl}
						alt={project.title}
						width={600}
						height={300}
						className='my-4 h-56 w-full rounded-xl object-cover'
					/>
				)}

				<p className='flex-1 line-clamp-3 text-muted-foreground'>
					{project.description}
				</p>

				<div className='mt-6 space-y-3'>
					<div className='flex gap-3'>
						{onEdit && (
							<Button
								className='flex-1'
								onClick={() => onEdit(project._id)}
							>
								Edit
							</Button>
						)}

						{onView && (
							<Button
								variant='secondary'
								className='flex-1'
								onClick={() => onView(project._id)}
							>
								View
							</Button>
						)}

						{onDelete && (
							<Button
								className='flex-1 bg-red-600 hover:bg-red-700'
								onClick={() => onDelete(project._id)}
							>
								Delete
							</Button>
						)}
					</div>

					{showFavoriteButton && onFavorite && (
						<Button
							variant='secondary'
							onClick={() => onFavorite(project._id, isFavorite)}
						>
							{isFavorite
								? '💖 Remove Favorite'
								: '🤍 Add Favorite'}
						</Button>
					)}
					{removeFavoriteButton && onRemoveFavorite && (
						<Button
							className='w-full bg-red-600 hover:bg-red-700'
							onClick={() => onRemoveFavorite(project._id)}
						>
							💖 Remove Favorite
						</Button>
					)}
				</div>
			</Card>
		</AnimatedCard>
	);
});

ProjectCard.displayName = 'ProjectCard';
