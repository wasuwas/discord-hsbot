/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ApplicationCommandData, Client, Intents } from 'discord.js'
import { setActivityOnline } from './activity';
import { getDiscordTokenFromLocal } from './credentials'
import {defineSlashCommand, interactToCommands} from './slashCommand'
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

function print(message): void {
  console.log(Object.keys({ message })[0] + ":" + message);
}

const discordMaxStringsLength = 2000;
function cutDiscordCharLengthLimit(text: string): string{
  if(text.length > discordMaxStringsLength){
    return text.slice(0,2000);
  } else {
    return text;
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('bot is ready!');

  defineSlashCommand(client);

  //Get All channel Id
  console.log("-----channel----------");
  client.channels.cache.forEach(channel => {
    console.log(JSON.stringify(channel, undefined, 2));
  });
  console.log("-----channel----------");
  console.log("-------guild--------");
  client.guilds.cache.forEach(guild => {
    console.log(JSON.stringify(guild, undefined, 2));
  });
  console.log("-------guild--------");

  console.log("-------users--------");
  client.users.cache.forEach(users => {
    console.log(JSON.stringify(users, undefined, 2));
  })
  console.log("-------users--------");

  setActivityOnline(client)
});

const botChannelId = "904329644168347688"
client.on('message', message => {
  console.log(JSON.stringify(message))
  if (message.author.bot) {
    return;
  }

  // botのチャネル以外のメッセージイベントは無視する
  if (message.channel.id !== botChannelId) {
    return;
  }
  message.channel.send({
    content: `${cutDiscordCharLengthLimit("on message："+ JSON.stringify(message, undefined, 2))}`,
    reply: { messageReference: message.id },
    // allowedMentions: { repliedUser: false }, // 4
  });
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }
  // botのチャネル以外のメッセージイベントは無視する
  if (message.channel.id !== botChannelId) {
    return;
  }
  console.log(message.content);
  message.channel.send({
    content: `${cutDiscordCharLengthLimit("on message："+ JSON.stringify(message, undefined, 2))}`,
    reply: { messageReference: message.id },
    // allowedMentions: { repliedUser: false }, // 4
  });
});

function onVoiceStateUpdate(oldState, newState): void {
  if (oldState.channelID === newState.channelID) {
    return;
  }

  if (oldState.channelID != null) {
    const oldChannel = oldState.guild.channels.cache.get(oldState.channelID);
    if (oldChannel.members.size == 0) {
      console.log("通話終了");
    } else {
      console.log("チャンネル退出：" + oldChannel, newState.member);
    }
  }

  if (newState.channelID != null) {
    const newChannel = newState.guild.channels.cache.get(newState.channelID);
    if (newChannel.members.size == 1) {
      console.log("通話開始:" + newChannel, newState.member);
    } else {
      console.log("通話開始、2人目join:" + newChannel, newState.member);
    }
    //通話開始時になんかする
  }
}

client.on('voiceStateUpdate', (oldMember, newMember) => {
  console.log(JSON.stringify(oldMember));
  console.log(JSON.stringify(newMember));
  onVoiceStateUpdate(oldMember, newMember)
});

client.on("interactionCreate", async (interaction) => {
  await interactToCommands(interaction);
});

client.login(getDiscordTokenFromLocal())
