import { generateDependencyReport } from '@discordjs/voice';
import { Client, Intents, TextChannel, } from 'discord.js'
import { setActivityOnline } from './activity';
import { logger } from './logging';
import { onMessageEvent } from './messageHandler';
import { defineSlashCommand, interactToCommands } from './slashcommands/commandManager';
import { getClientStatus } from './util';
import { onVoiceStateUpdateEvent } from './voiceEventHandler';
require('dotenv').config();

/**
 * Refs:
 * https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584
 */

// Enable library report
console.log(generateDependencyReport());

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,

    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,

    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`);
  logger.info('bot is ready!');

  defineSlashCommand(client);
  getClientStatus(client);
  setActivityOnline(client);
  onMessageEvent(client);
  onVoiceStateUpdateEvent(client);
});

// debug
/* Emitted for general debugging information.
PARAMETER    TYPE         DESCRIPTION
info         string       The debug information    */
client.on("debug", function (info) {
  logger.debug(JSON.stringify(info, undefined, 2));
});

// guildMemberSpeaking
/* Emitted once a guild member starts/stops speaking.
PARAMETER     TYPE                DESCRIPTION
member        GuildMember         The member that started/stopped speaking
speaking      boolean             Whether or not the member is speaking    */
client.on("guildMemberSpeaking", function (member, speaking) {
  console.log(`a guild member starts/stops speaking: ${member.tag}`);
  console.log(JSON.stringify(member, undefined, 2));
  console.log(JSON.stringify(speaking, undefined, 2));
});

// messageReactionAdd
/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
messageReaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
client.on("messageReactionAdd", function (messageReaction, _user) {
  console.log(`a reaction is added to a message`);
  console.log(JSON.stringify(messageReaction, undefined, 2));
});

// presenceUpdate
/* Emitted whenever a guild member's presence changes, or they change one of their details.
PARAMETER    TYPE               DESCRIPTION
oldMember    GuildMember        The member before the presence update
newMember    GuildMember        The member after the presence update    */
client.on("presenceUpdate", function (oldMember, newMember) {
  logger.debug("presenceUpdate");
  if (oldMember.status != newMember.status) {
    const message = "User: " + newMember.user.username + " status =>" + oldMember.status + "->" + newMember.status;
    logger.debug(message);
    const channel: TextChannel = this.channels.cache.get(process.env.BOT_TEST_CHANNEL_ID);
    channel.send(message);
  }
});

client.on("interactionCreate", async (interaction) => {
  await interactToCommands(client, interaction);
});

client.login(process.env.DISCORD_BOT_TOKEN);

