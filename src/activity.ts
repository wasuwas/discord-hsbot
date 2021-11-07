import { Client } from "discord.js";

export function setActivityOnline(client: Client): void {
    client.user.setPresence({
        status: 'online',
        activities:[
            {
                name:"bot",
                type:"PLAYING",
                url:"https://github.com/wasuwasu/discord-hsbot"
            }
        ],
    })
}