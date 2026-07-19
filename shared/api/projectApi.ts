import { axiosInstance } from './axios';

type CreateProjectData = {
	title: string;
	description: string;
};

type CreateProjectResponse = {
	success: boolean;
	message: string;
	project: {
		_id: string;
		title: string;
		description: string;
		owner: string;
		createdAt: string;
		updatedAt: string;
	};
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
			projects: {
				_id: string;
				title: string;
				description: string;
				owner: string;
				createdAt: string;
				updatedAt: string;
			}[];
		}>('/projects');

		return response.data;
	},
};
