import { Client } from 'discord.js';
import moment from 'moment';
import { logger } from './logging';

export function getCurrentDateTime(): string {
    const currentTime = moment();
    return currentTime.format("YYYY/MM/DD/ HH:mm:ss");
}

export function getClientStatus(client: Client): void {
    if (process.env.DEBUG == "true") {
      logger.debug("-----channel----------");
      logger.debug(JSON.stringify(client.channels.cache, undefined, 2));
      logger.debug("-----channel----------");
      logger.debug("-------guild--------");
      logger.debug(JSON.stringify(client.guilds.cache, undefined, 2));
      logger.debug("-------guild--------");
      logger.debug("-------users--------");
      logger.debug(JSON.stringify(client.users.cache, undefined, 2));
      logger.debug("-------users--------");
      logger.debug("-------voice--------");
      logger.debug(JSON.stringify(client.voice, undefined, 2));
      logger.debug("-------voice--------");
    }
  }