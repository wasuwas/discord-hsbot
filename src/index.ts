import { generateDependencyReport} from '@discordjs/voice';
import { Client, Intents, MessageEmbed, TextChannel, User } from 'discord.js'
import { setActivityOnline } from './activity';
import { logger } from './logging';
import { onMessageEvent } from './messageHandler';
import { defineSlashCommand, interactToCommands } from './slashcommands/googlehomeTts'
import { onVoiceStateUpdateEvent } from './voiceEventHandler';
require('dotenv').config();
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

function getClientStatus(client: Client): void {
  if (process.env.DEBUG == "true") {
    logger.debug("-----channel----------");
    logger.debug(JSON.stringify(client.channels.cache, undefined, 2));
    logger.debug("-----channel----------");
    logger.debug("-------guild--------");
    logger.debug(JSON.stringify(client.guilds.cache, undefined, 2));
    logger.debug("-------guild--------");
    logger.debug("-------users--------");
    logger.debug(JSON.stringify(client.users.cache, undefined, 2));
    logger.debug("-------users--------");
    logger.debug("-------voice--------");
    logger.debug(JSON.stringify(client.voice, undefined, 2));
    logger.debug("-------voice--------");
  }
}

/**
 * Refs:
 * https://gist.github.com/koad/316b265a91d933fd1b62dddfcc3ff584
 */

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
  console.log(`a guild member's presence changes`);
  // console.log(JSON.stringify(oldMember, undefined, 2));
  // console.log(JSON.stringify(newMember, undefined, 2));
  // const user = getUserById(newMember.userId);
  const message = "User:" + newMember.user.username + " status =>" + oldMember.status + "->" + newMember.status;
  logger.debug(message);
  const channel: TextChannel = this.channels.cache.get(process.env.BOT_TEST_CHANNEL_ID);
  channel.send(message);
});

client.on("interactionCreate", async (interaction) => {
  await interactToCommands(interaction);
});

client.login(process.env.DISCORD_BOT_TOKEN);

