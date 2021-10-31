import { ApplicationCommandData, Client, Interaction } from "discord.js";
import axiosBase from 'axios';
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
    const command = await client.application?.commands.set(data, process.env.SERVER_GUILD_ID)
        .then(console.log)
        .catch(console.error);
    console.log("Ready!");
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
            console.log(response.data);
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
    console.log("-----------------------------")
    console.log(JSON.stringify(interaction.options));
    console.log("-----------------------------")
}
