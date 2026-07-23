import { axiosInstance } from './axios';

type CreateProjectData = {
	title: string;
	description: string;
};

type Project = {
	_id: string;
	title: string;
	description: string;
	owner: string;
	createdAt: string;
	updatedAt: string;
};

type CreateProjectResponse = {
	success: boolean;
	message: string;
	project: Project;
};

export const projectApi = {
	create: async (data: CreateProjectData) => {
		const response = await axiosInstance.post<CreateProjectResponse>(
			'/projects',
			data,
		);

		return response.data;
	},

	getAll: async () => {
		const response = await axiosInstance.get<{
			success: boolean;
			projects: Project[];
		}>('/projects');

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
