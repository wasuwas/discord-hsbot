import { Client } from "discord.js";
import { logger } from "./logging";

function onVoiceStateUpdate(oldState, newState): void {
    if (oldState.channelID === newState.channelID) {
        return;
    }

    if (oldState.channelID != null) {
        const oldChannel = oldState.guild.channels.cache.get(oldState.channelID);
        if (oldChannel.members.size == 0) {
            logger.debug("通話終了");
        } else {
            logger.debug("チャンネル退出：" + oldChannel, newState.member);
        }
    }

    if (newState.channelID != null) {
        const newChannel = newState.guild.channels.cache.get(newState.channelID);
        if (newChannel.members.size == 1) {
            logger.debug("通話開始:" + newChannel, newState.member);
        } else {
            logger.debug("通話開始、2人目join:" + newChannel, newState.member);
        }
        //通話開始時になんかする
    }
}
export function onVoiceStateUpdateEvent(client: Client): void {
    client.on('voiceStateUpdate', (oldMember, newMember) => {
        logger.debug(JSON.stringify(oldMember));
        logger.debug(JSON.stringify(newMember));
        onVoiceStateUpdate(oldMember, newMember)
    });
}