import "dotenv/config";
import http from "./http.service";
import { AxiosRequestConfig } from "axios";

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

export default discordRequest;
