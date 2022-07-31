import { verifyKey } from "discord-interactions";
import express, { Request, Response } from "express";

export function verifyDiscordRequest(clientKey: string) {
  return express.json({
    verify: function (req: Request, res: Response, buf: Buffer) {
      const signature = req.get("X-Signature-Ed25519") || "";
      const timestamp = req.get("X-Signature-Timestamp") || "";

      const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);

      if (!isValidRequest) {
        res.status(401).send("Bad request signature");
        // throwing error here aborts parsing
        throw new Error("Bad request signature");
      }
    },
  });
}

export default verifyDiscordRequest;
