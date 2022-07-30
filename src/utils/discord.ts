import "dotenv/config";
import axios, { AxiosRequestConfig } from "axios";
import { verifyKey } from "discord-interactions";
import { Request, Response } from "express";

axios.interceptors.request.use((x) => {
  console.log(
    `${new Date()} | REQUEST: ${x.method?.toUpperCase()} | ${
      x.url
    } | ${JSON.stringify(x.data)}`
  );
  return x;
});

// this really should be a middleware
export function VerifyDiscordRequest(clientKey: string) {
  return function (req: Request, res: Response, buf: Buffer) {
    const signature = req.get("X-Signature-Ed25519") || "";
    const timestamp = req.get("X-Signature-Timestamp") || "";

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send("Bad request signature");
      throw new Error("Bad request signature");
    }
  };
}

export async function DiscordRequest(
  endpoint: string,
  config?: AxiosRequestConfig
) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  const res = await axios({
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
