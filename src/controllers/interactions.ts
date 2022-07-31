import { InteractionType, InteractionResponseType } from "discord-interactions";
import { Request, Response } from "express";

export function handleInteractions(req: Request, res: Response) {
  // Interaction type and data
  const { type, data, id } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    // Slash command with name of "test"
    if (data.name === "test") {
      // Send a message as response
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: "A wild message appeared" },
      });
    }
  }
}
