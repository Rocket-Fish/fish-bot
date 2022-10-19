import { AxiosRequestConfig } from 'axios';
import { FFLOGS_CLIENT_ID, FFLOGS_CLIENT_SECRET, IS_DEVELOPMENT } from '../discord/env';
import http from '../http';
import redisClient from '../redis-client';

const redisKey = 'fflogs-access-token';

async function updateToken(token: string) {
    return await redisClient.setEx(redisKey, 60 * 60 * 24 * 180, token);
}

/**
 * @throws {Error} if access token is not present
 * @throws {HTTPError} if http request failed
 * @returns a promise that if resolved returns a string representing the access token to fflogs api
 */
export async function getAccessToken(): Promise<string> {
    const token = await redisClient.get(redisKey);
    if (token) {
        return token;
    } else {
        const config: AxiosRequestConfig = {
            url: 'https://www.fflogs.com/oauth/token',
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${FFLOGS_CLIENT_ID}:${FFLOGS_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded;',
            },
            data: 'grant_type=client_credentials',
        };
        const response = await http(config);

        const json = response.data;

        if (json.access_token) {
            console.log('FFlogs api initialized');
            if (IS_DEVELOPMENT) {
                console.log(`FFlogs access_token: ${json.access_token}`);
            }
            updateToken(json.access_token);
            return json.access_token;
        } else {
            throw new Error('access_token is empty');
        }
    }
}
