import "dotenv/config";
import http from "../http";
import { AxiosError, AxiosRequestConfig } from "axios";
import util from "util";

export async function discordRequest(
  endpoint: string,
  config?: AxiosRequestConfig
) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  const res = await http({
    url,
    headers: {
      Authorization: `Bot ${process.env.D_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "FishBot (https://github.com/LocalFishCateringServiceNearYou/fish-bot, 1.0.0)",
    },
    ...config,
  });
  return res;
}

export function handleError(err: unknown) {
  if (err instanceof AxiosError)
    console.error(
      "Error installing commands:",
      err.code,
      err.message,
      util.inspect(err.response?.data, {
        showHidden: true,
        depth: null,
        colors: true,
      })
    );
  else console.error(err);
}

export default discordRequest;
