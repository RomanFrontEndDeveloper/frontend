import { axiosInstance } from './axios';

export interface DashboardStats {
	projectsCount: number;
	lastProject: string;
	lastUpdate: string | null;
}

interface DashboardResponse {
	success: boolean;
	stats: DashboardStats;
}

export const dashboardApi = {
	getStats: async (): Promise<DashboardResponse> => {
		const { data } = await axiosInstance.get('/dashboard/stats');

		return data;
	},
};
