import { ChatGPT } from "../bot.ts";
import {
  Interaction,
  InteractionResponseTypes,
  InteractionTypes,
} from "discordeno/mod.ts";
import { EmbedBuilder } from "lib/embed.ts";
import log from "utils/logger.ts";

ChatGPT.events.interactionCreate = (_, interaction) => {
  if (!interaction.data) return;

  switch (interaction.type) {
    case InteractionTypes.ApplicationCommand: {
      const args = interaction.data.options;
      if (!args) {
        const reply = ChatGPT.commands
          .get(interaction.data.name!)
          ?.execute(interaction);
        response(reply, interaction);
      } else {
        const reply = ChatGPT.commands
          .get(interaction.data.name!)
          ?.execute(interaction, args);
        response(reply, interaction);
      }
      break;
    }
  }
};

const error_embeds = new EmbedBuilder().setTitle("⚠️ERROR⚠️")
  .setDescription(`予期せぬエラーが発生しました。
オプションを確認し、
時間を置いて再度試してください。`);

function response(
  reply: EmbedBuilder | Promise<EmbedBuilder> | undefined,
  interaction: Interaction
) {
  if (reply instanceof Promise<EmbedBuilder>) {
    reply
      .then((embed) => {
        ChatGPT.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              embeds: [embed.data],
            },
          }
        );
      })
      .catch((error) => {
        ChatGPT.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              embeds: [error_embeds.data],
            },
          }
        );
        log.error(error);
      });
  } else if (reply instanceof EmbedBuilder) {
    ChatGPT.helpers.sendInteractionResponse(interaction.id, interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        embeds: [reply.data],
      },
    });
  } else {
    ChatGPT.helpers.sendInteractionResponse(interaction.id, interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        embeds: [error_embeds.data],
      },
    });
    log.error("(response) undefined error");
  }
}
