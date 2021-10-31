import { Client } from "discord.js";

export function setActivityOnline(client: Client): void {
    client.user.setPresence({
        status: 'online',
    })
}