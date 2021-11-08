import { ApplicationCommandData, Client, Interaction } from "discord.js";
import { logger } from "../logging";
import {speakByGoogleHome } from "./googlehomeTts";
import { getCurrentWeatherAll} from "./weatherReport";

export const googleTtsCommandName = "googlehome_yomiage";
export const weatherCommandName = "tenki";
export async function defineSlashCommand(client: Client): Promise<void> {
    const data: ApplicationCommandData[] = [{
        name: googleTtsCommandName,
        description: "GoogleHomeから音を発します",
        options: [
            {
                type: "STRING",
                name: "message",
                description: "読み上げテキスト",
                required: true
            }]
    },
    {
        name: weatherCommandName,
        description: "天気情報を取得します。",
        options: [
            {
                type: "STRING",
                name: weatherCommandName,
                description: "天気情報を取得します。",
                required: false
            }]
    }
    ];
    await client.application?.commands.set(data, process.env.SERVER_GUILD_ID)
        .catch(console.error);
}

export async function interactToCommands(client: Client, interaction: Interaction): Promise<void> {
    if (!interaction.isCommand()) {
        return;
    }
    const commandsList = client.application?.commands.cache.map((c) => c.name);
    if (commandsList.includes(interaction.commandName)) {
        if (interaction.commandName == googleTtsCommandName) {
            await interaction.reply('コマンドを実行しました');
            speakByGoogleHome(interaction.options.data[0].value as string);
        }
        if (interaction.commandName == weatherCommandName) {
            const res = getCurrentWeatherAll();
            interaction.channel.send({ embeds: res });
        }
    }
    logger.debug("-----------------------------")
    logger.debug(JSON.stringify(interaction.options));
    logger.debug("-----------------------------")
}
