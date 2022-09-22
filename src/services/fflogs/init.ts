import { AxiosRequestConfig } from 'axios';
import http, { HTTPError } from '../http';

/**
 * @throws {Error} if access token is not present
 * @throws {HTTPError} if http request failed
 * @returns a promise that if resolved returns a string representing the access token to fflogs api
 */
export async function getAccessToken(): Promise<string> {
    const config: AxiosRequestConfig = {
        url: 'https://www.fflogs.com/oauth/token',
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.FFLOGS_CLIENT_ID}:${process.env.FFLOGS_CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded;',
        },
        data: 'grant_type=client_credentials',
    };
    const response = await http(config);

    const json = response.data;

    if (json.access_token) {
        console.log('fflogs api initialized');
        return json.access_token;
    } else {
        throw new Error('access_token is empty');
    }
}
