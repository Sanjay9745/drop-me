import api from './api';

interface LatLng {
    latitude: number;
    longitude: number;
}
interface DailyRouteRes {
    id: string;
    userId: string;
    startLocation: {
        latitude: number;
        longitude: number;
    };
    endLocation: {
        latitude: number;
        longitude: number;
    };
    middleLocations?: {
        latitude: number;
        longitude: number;
    }[];
    fromDateTime?: string | null;
    toDateTime?: string | null;
    distance: number;
    duration: number;
    createdAt: string;
    updatedAt: string;
}

interface DailyRouteReq {
        start: LatLng | null;
        end: LatLng | null;
        middle: LatLng[];
        fromDateTime: string | null;
        toDateTime: string | null;
        distance: string;
        duration: string;
}

export const getDailyRoutes = async (): Promise<DailyRouteRes[]> => {
    try {
        const response = await api.get<DailyRouteRes[]>('/daily-routes');
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const addDailyRoute = async (route: Promise<DailyRouteReq>) => {
    try {
        const response = await api.post<DailyRouteReq>('/daily-routes', route);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const deleteDailyRoute = async (id: string): Promise<void> => {
    try {
        await api.delete(`/daily-routes/${id}`);
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const updateDailyRoute = async (route: DailyRouteRes): Promise<DailyRouteRes> => {
    try {
        const response = await api.put<DailyRouteRes>(`/daily-routes/${route.id}`, route);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};