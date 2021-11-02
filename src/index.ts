/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {Client, Intents } from 'discord.js'
import { setActivityOnline } from './activity';
import { logger } from './logging';
import {onMessageEvent } from './messageHandler';
import {defineSlashCommand, interactToCommands} from './slashcommands/googlehomeTts'
import { onVoiceStateUpdateEvent } from './voiceEventHandler';
require('dotenv').config();
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`);
  logger.info('bot is ready!');

  defineSlashCommand(client);
  //Get All channel Id
  logger.debug("-----channel----------");
  logger.debug(JSON.stringify(client.channels.cache, undefined, 2));
  logger.debug("-----channel----------");
  logger.debug("-------guild--------");
  logger.debug(JSON.stringify(client.guilds.cache, undefined, 2));
  logger.debug("-------guild--------");
  logger.debug("-------users--------");
  logger.debug(JSON.stringify(client.users.cache, undefined, 2));
  logger.debug("-------users--------");

  setActivityOnline(client);
  onMessageEvent(client);
  onVoiceStateUpdateEvent(client);
});

client.on("interactionCreate", async (interaction) => {
  await interactToCommands(interaction);
});

client.login(process.env.DISCORD_BOT_TOKEN);
