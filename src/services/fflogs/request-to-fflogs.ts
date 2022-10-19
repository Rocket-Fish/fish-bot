import http from '../http';
import { getAccessToken } from './get-access-token';

export async function requestToFflogs(query: string) {
    const accessToken = await getAccessToken();
    const response = await http({
        url: 'https://www.fflogs.com/api/v2/client',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data: {
            query,
        },
    });

    return response.data;
}
