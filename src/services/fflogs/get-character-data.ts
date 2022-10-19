import { Worlds } from '../core/extract-character';
import { worldToRegion } from '../core/world-to-region';
import { HTTPError } from '../http';
import redisClient from '../redis-client';
import { requestToFflogs } from './request-to-fflogs';
import util from 'util';
import { sleep } from '../../utils/sleep';

function generateRedisKey(...params: (string | number)[]): string {
    return 'fflogs-zone-rankings=>' + params.join(':');
}

async function cacheResponse(response: any, name: string, server: Worlds, zoneId: number, difficulty: number) {
    // expire in 20 min
    return await redisClient.setEx(generateRedisKey(name, server, zoneId, difficulty), 60 * 20, JSON.stringify(response));
}

type RateLimitData = {
    limitPerHour: number;
    pointsSpentThisHour: number;
    pointsResetIn: number;
};

const rateLimitKey = 'fflogs-rate-limit';
async function cacheRateLimit(rateLimitData: RateLimitData) {
    // expire once every hour
    return await redisClient.setEx(rateLimitKey, 60 * 60, JSON.stringify(rateLimitData));
}

export async function getCharacterZoneRankings(
    name: string,
    server: Worlds,
    zoneId: number,
    difficulty: number,
    retryCount: number = 10
): Promise<any> {
    const cachedResult = await redisClient.get(generateRedisKey(name, server, zoneId, difficulty));

    if (cachedResult) {
        return JSON.parse(cachedResult);
    } else {
        try {
            const response = await requestToFflogs(`
        query {
            rateLimitData {
                limitPerHour,
                pointsSpentThisHour,
                pointsResetIn
            },
            characterData {
                character(name: "${name}", serverSlug: "${server.toLowerCase()}", serverRegion: "${worldToRegion[server]}") {
                    zoneRankings(zoneID: ${zoneId}, timeframe: Today, metric: rdps, difficulty: ${difficulty}, includePrivateLogs: true)
                }
            }
        }
        `);
            await cacheResponse(response.data.characterData, name, server, zoneId, difficulty);
            await cacheRateLimit(response.data.rateLimitData);
            return response.data.characterData;
        } catch (e) {
            logFailedRequestToFflogs(e);
            if (e instanceof HTTPError) {
                if (e.status === 429) {
                    try {
                        const rateLimitJSON = await redisClient.get(rateLimitKey);
                        if (rateLimitJSON) {
                            const rateLimitData: RateLimitData = JSON.parse(rateLimitJSON);
                            const retryAfter = Number(rateLimitData.pointsResetIn);
                            if (!isNaN(retryAfter) && retryCount > 0) {
                                // conert seconds to milliseconds and math.ceil it + 100ms at the end for safety margin
                                const sleepTime = Math.ceil(retryAfter * 1000) + 100;
                                console.log(`FFlogs rate limit hit, retrying in ${sleepTime}ms`);
                                await sleep(sleepTime);
                                return getCharacterZoneRankings(name, server, zoneId, difficulty, retryCount - 1);
                            }
                        }
                    } catch (e) {
                        console.log('failed to get rate limit cache for fflogs api', e);
                    }
                }
            }
            throw e;
        }
    }
}

function logFailedRequestToFflogs(err: unknown) {
    if (err instanceof HTTPError)
        console.log(
            `Error while obtaining character zone rankings: ${err.url} | ${err.code} | ${err.message}\n`,
            util.inspect(err.data, {
                showHidden: false,
                depth: null,
                colors: true,
            })
        );
    else console.log('Unknown error has occurred');
}
