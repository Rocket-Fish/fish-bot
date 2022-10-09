import 'dotenv/config';
import http, { HTTPError } from '../http';
import { AxiosRequestConfig } from 'axios';
import util from 'util';
import { DISCORD_TOKEN } from './env';
import { sleep } from '../../utils/sleep';

/**
 *
 * @param endpoint endpoints without initial slash; eg. "guilds/${id}"
 * @param config additional axios config
 * @param retryCount number of retrys on rate limit
 * @returns server response
 * @throws HTTPError
 */
export async function requestToDiscord(endpoint: string, config?: AxiosRequestConfig, retryCount: number = 10): Promise<any> {
    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint;
    try {
        return await http({
            url,
            headers: {
                Authorization: `Bot ${DISCORD_TOKEN}`,
                'Content-Type': 'application/json; charset=UTF-8',
                'User-Agent': 'FishBot (https://github.com/Rocket-Fish/fish-bot, 1.0.0)',
            },
            ...config,
        });
    } catch (e) {
        logFailedRequestToDiscord(e);
        if (e instanceof HTTPError) {
            if (e.status === 429) {
                const retryAfter = Number(e.data.retry_after);
                if (!isNaN(retryAfter) && retryCount > 0) {
                    // conert seconds to milliseconds and math.ceil it + 100ms at the end for safety margin
                    const sleepTime = Math.ceil(retryAfter * 1000) + 100;
                    console.log(`Rate limit hit, retrying in ${sleepTime}ms`);
                    await sleep(sleepTime);
                    return requestToDiscord(endpoint, config, retryCount - 1);
                }
            }
        }
        throw e;
    }
}

function logFailedRequestToDiscord(err: unknown) {
    if (err instanceof HTTPError)
        console.log(
            `Error while making request to discord: ${err.url} | ${err.code} | ${err.message}\n`,
            util.inspect(err.data, {
                showHidden: false,
                depth: null,
                colors: true,
            })
        );
    else console.log('Unkown error has occured');
}

export default requestToDiscord;
