import { ChatGPT } from "../bot.ts";
import log from "utils/logger.ts";

export async function updateAppcationCommands() {
  await ChatGPT.helpers.upsertGlobalApplicationCommands(
    ChatGPT.commands.array()
  );
  log.info(ChatGPT.commands.array());
}
