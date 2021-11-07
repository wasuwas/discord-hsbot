import { ApplicationCommandData, Client, Interaction } from "discord.js";
import axiosBase from 'axios';
import { logger } from "../logging";
require('dotenv').config();

export async function defineSlashCommand(client: Client): Promise<void> {
    const data: ApplicationCommandData[] = [{
        name: "googlehome_yomiage",
        description: "GoogleHomeから音を発します",
        options: [
            {
                type: "STRING",
                name: "message",
                description: "読み上げテキスト",
                required: true
            }]
    }];
    await client.application?.commands.set(data, process.env.SERVER_GUILD_ID)
        .catch(console.error);
}

export function speakByGoogleHome(message: string): void {
    const axios = axiosBase.create({
        baseURL: process.env.GOOGLEHOME_NOTIFIER_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        responseType: 'json'
    });
    axios.post('/google-home-notifier',
        { "text": message })
        .then(function (response) {
            logger.debug(response.data);
        });
}

export async function interactToCommands(interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
        return;
    }
    if (interaction.commandName === 'googlehome_yomiage') {
        await interaction.reply('コマンドを実行しました');
        speakByGoogleHome(interaction.options.data[0].value as string)
    }
    logger.debug("-----------------------------")
    logger.debug(JSON.stringify(interaction.options));
    logger.debug("-----------------------------")
}
