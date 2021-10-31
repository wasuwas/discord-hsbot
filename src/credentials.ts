import fs from 'fs';

const credentialJsonFilePath = 'app.json';
export function getDiscordTokenFromLocal(): string {
    try {
        const cred = JSON.parse(fs.readFileSync(credentialJsonFilePath, 'utf8'));
        return cred.env.DISCORD_TOKEN;
    } catch (e) {
        console.log("Read Credentials failed!");
        console.log(e);
        return "";
    }
}
