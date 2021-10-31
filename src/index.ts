/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { channel } from 'diagnostics_channel';
import { ApplicationCommandData, Client,Intents  } from 'discord.js'
import {getDiscordTokenFromLocal} from './credentials'
const client = new Client({ intents: [
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
] });

function print(message): void {
  console.log(Object.keys({message})[0] + ":" + message);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('bot is ready!');

  //Get All channel Id
  console.log("-----channel----------");
  client.channels.cache.forEach(channel =>{
    console.log(JSON.stringify(channel));
  });
  console.log("-----channel----------");
  console.log("-------guild--------");
client.guilds.cache.forEach(guild=>{
  console.log(JSON.stringify(guild));
});
console.log("-------guild--------");

console.log("-------users--------");
client.users.cache.forEach(users=>{
  console.log(JSON.stringify(users));
})
console.log("-------users--------");

  client.user.setPresence({
    status: 'online',
  });
});

client.on('message', message => {
  console.log(message)
	if (message.content === 'ping') {
		message.channel.send('Pong.');
	}
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }
  console.log(message.content);
  message.channel.send({
    content: `受信したメッセージ：${message.content}`,
    reply: {messageReference: message.id},
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
      console.log("チャンネル退出："+ oldChannel, newState.member);
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

client.on('voiceStateUpdate', (oldMember, newMember)=> {
  console.log(JSON.stringify(oldMember));
  console.log(JSON.stringify(newMember));
  onVoiceStateUpdate(oldMember, newMember)
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  if (interaction.commandName === 'run_the_slash_command') {
    await interaction.reply('コマンドを実行しました！');
  }
  console.log(interaction);
});

client.login(getDiscordTokenFromLocal())



