import { Client } from "discord.js";
import { logger } from "./logging";

const discordMaxStringsLength = 2000;
function cutDiscordCharLengthLimit(text: string): string{
  if(text.length > discordMaxStringsLength){
    return text.slice(0,discordMaxStringsLength);
  } else {
    return text;
  }
}

export function onMessageEvent(client: Client): void {
    client.on('message', message => {
      if (message.author.bot) {
        return;
      }
      
      // botのチャネル以外のメッセージイベントは無視する
      if (message.channel.id !== process.env.BOT_TEST_CHANNEL_ID) {
        return;
      }
      logger.debug(JSON.stringify(message,undefined,2));
        message.channel.send({
          content: `${cutDiscordCharLengthLimit("on message："+ JSON.stringify(message, undefined, 2))}`,
          reply: { messageReference: message.id },
          // allowedMentions: { repliedUser: false }, // 4
        });
      });
}

// export function onmessageCreateEvent(client: Client): void {
//   client.on("messageCreate", (message) => {
//     if (message.author.bot) {
//       return;
//     }
//     // botのチャネル以外のメッセージイベントは無視する
//     if (message.channel.id !== process.env.BOT_TEST_CHANNEL_ID) {
//       return;
//     }
//     logger.debug(JSON.stringify(message,undefined,2));
//     message.channel.send({
//       content: `${cutDiscordCharLengthLimit("on message："+ JSON.stringify(message, undefined, 2))}`,
//       reply: { messageReference: message.id },
//       // allowedMentions: { repliedUser: false }, // 4
//     });
//   });
// }
