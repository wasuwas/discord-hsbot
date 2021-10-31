import { ApplicationCommandData, Client, Interaction } from "discord.js";
import axiosBase from 'axios';

const guildId = '904276427757727784';
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
    const command = await client.application?.commands.set(data, guildId)
        .then(console.log)
        .catch(console.error);
    console.log("Ready!");
}

export function speakByGoogleHome(message: string): void {
    const axios = axiosBase.create({
        //curl -X POST -H "Content-Type:application/json" -d '{"text":"Google Home"}'http://192.168.0.18:8091/google-home-notifier
        baseURL: 'http://192.168.0.18:8091', // バックエンドB のURL:port を指定する
        headers: {
            'Content-Type': 'application/json'
        },
        responseType: 'json'
    });
    axios.post('/google-home-notifier',
        { "text": message }).then(function (response) {
            console.log(response.data);
        })
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
