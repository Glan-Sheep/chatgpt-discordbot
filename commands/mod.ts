import { ChatGPT } from "../bot.ts";
import { Command } from "lib/mod.ts";

export function createCommand(command: Command) {
  if (!command.devOnly) ChatGPT.commands.set(command.name, command);
}
