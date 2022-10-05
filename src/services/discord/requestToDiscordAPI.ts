import 'dotenv/config';
import http, { HTTPError } from '../http';
import { AxiosRequestConfig } from 'axios';
import util from 'util';
import { DISCORD_TOKEN } from './env';

export async function requestToDiscord(endpoint: string, config?: AxiosRequestConfig) {
    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint;
    const res = await http({
        url,
        headers: {
            Authorization: `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': 'FishBot (https://github.com/Rocket-Fish/fish-bot, 1.0.0)',
        },
        ...config,
    });
    return res;
}

export function logFailedRequestToDiscord(err: unknown) {
    if (err instanceof HTTPError)
        console.error(
            `Error while making request to discord: ${err.url} | ${err.code} | ${err.message}\n`,
            util.inspect(err.data, {
                showHidden: false,
                depth: null,
                colors: true,
            })
        );
    else console.error('Unkown error has occured');
}

export default requestToDiscord;
