import { Client, MessageEmbed, TextChannel } from "discord.js";
import { logger } from "./logging";

export function onVoiceStateUpdateEvent(client: Client): void {
    /**
     * 通話の状態を通知するメッセージ
     */
    client.on("voiceStateUpdate", function (oldMember, newMember) {
        logger.debug("voiceStateUpdate");
        const userName = newMember.member.user.username;
        const embeddedMessage = new MessageEmbed()
            .setTitle('通話状態通知: ' + userName)
            .setColor(7506394)
            ;

        if (!oldMember.sessionId  && newMember.sessionId) {
            console.log(userName + "が通話に参加しました。");
        } else {
            console.log(userName + "が通話から退出しました。");
        }

        if (oldMember.selfMute != newMember.selfMute) {
            embeddedMessage.addField("マイクミュート：", newMember.selfMute ? "有効" : "無効");
        }
        if (oldMember.selfDeaf != newMember.selfDeaf) {
            embeddedMessage.addField("スピーカーミュート：", newMember.selfDeaf ? "有効" : "無効");
        }
        if (oldMember.streaming != newMember.streaming) {
            embeddedMessage.addField("画面共有：", newMember.streaming ? "有効" : "無効");
        }
        const channel: TextChannel = this.channels.cache.get(process.env.BOT_TEST_CHANNEL_ID);
        channel.send({ embeds: [embeddedMessage] });
    });
}