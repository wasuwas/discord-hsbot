import { Client, MessageEmbed, TextChannel } from "discord.js";
import { logger } from "./logging";
import { getCurrentDateTime } from "./util";

export function onVoiceStateUpdateEvent(client: Client): void {
    /**
     * 通話の状態を通知するメッセージ
     */
    client.on("voiceStateUpdate", function (oldMember, newMember) {
        logger.debug("voiceStateUpdate");
        if (process.env.DEBUG == "true") {
            console.log(JSON.stringify(oldMember, undefined, 2));
            console.log(JSON.stringify(newMember, undefined, 2));
        }
        const userName = newMember.member.user.username;
        const embeddedMessage = new MessageEmbed()
            .setTitle('通話状態通知: ')
            .setColor("#1ABC9C")
            .setDescription(userName + ":" + getCurrentDateTime())
            ;

        const channel: TextChannel = this.channels.cache.get(process.env.VOICE_NOTIFICATION_CHANNEL_ID);
        if (oldMember.sessionId != newMember.sessionId) {
            if (!oldMember.sessionId && newMember.sessionId) {
                const message = userName + "が通話に参加しました。";
                logger.info(message);
                channel.send(message);
            } else {
                const message = userName + "が通話から退出しました。";
                logger.info(message);
                channel.send(message);
            }
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
        if (embeddedMessage.fields.length > 0) {
            channel.send({ embeds: [embeddedMessage] });
        }
    });
}