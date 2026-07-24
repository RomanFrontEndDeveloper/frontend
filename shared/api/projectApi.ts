import { axiosInstance } from './axios';
import { CreateProjectData } from '@/shared/validation/project';

const DEFAULT_LIMIT = 3;

type Project = {
	_id: string;
	title: string;
	description: string;
	owner: string;
	createdAt: string;
	updatedAt: string;
	imageUrl?: string;
	imagePublicId?: string;
};

type CreateProjectResponse = {
	success: boolean;
	message: string;
	project: Project;
};

export const projectApi = {
	create: async (data: CreateProjectData) => {
		const formData = new FormData();

		formData.append('title', data.title);
		formData.append('description', data.description);

		if (data.image) {
			formData.append('image', data.image);
		}

		const response = await axiosInstance.post<CreateProjectResponse>(
			'/projects',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		);

		return response.data;
	},

	getAll: async (search = '', page = 1, limit = DEFAULT_LIMIT) => {
		const response = await axiosInstance.get<{
			success: boolean;
			projects: Project[];
			currentPage: number;
			totalPages: number;
			totalProjects: number;
		}>('/projects', {
			params: {
				search,
				page,
				limit,
			},
		});

		return response.data;
	},

	getById: async (id: string) => {
		const response = await axiosInstance.get<{
			success: boolean;
			project: Project;
		}>(`/projects/${id}`);

		return response.data;
	},

	update: async (id: string, data: CreateProjectData) => {
		const response = await axiosInstance.put<{
			success: boolean;
			message: string;
			project: Project;
		}>(`/projects/${id}`, data);

		return response.data;
	},

	delete: async (id: string) => {
		const response = await axiosInstance.delete<{
			success: boolean;
			message: string;
			project: Project;
		}>(`/projects/${id}`);

		return response.data;
	},
};
