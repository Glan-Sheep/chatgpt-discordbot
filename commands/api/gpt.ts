import {
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
} from "discordeno/mod.ts";
import { axiod } from "axiod";
import { createCommand } from "../mod.ts";
import { EmbedBuilder } from "lib/mod.ts";
import { config } from "dotenv";
import { ChatGPTAPI } from "npm:chatgpt";
const env = config();

createCommand({
  name: "gpt",
  description: "AIとの会話",
  type: ApplicationCommandTypes.ChatInput,
  options: [
    {
      type: ApplicationCommandOptionTypes.String,
      name: "text",
      description: "会話内容を入力してください",
      required: true,
    },
  ],
  async execute(_interaction, args): Promise<EmbedBuilder> {
    const embeds = new EmbedBuilder();
    const api = new ChatGPTAPI({
      apiKey: env["CHATGPT_TOKEN"],
    });
    const res = await api.sendMessage(args[0].value);

    embeds.setTitle(`質問内容: ${args[0].value}`)
      .setDescription(res.text);
    return embeds;
  },
});
