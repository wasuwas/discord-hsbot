import winston from 'winston';
const format = winston.format;

export const logger = winston.createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp(),  // timestampを出力する
        format.splat(),  // String interpolation splat for %d %s-style messages.
        format.cli(),
        format.printf(log => `[${log.timestamp}][${log.level}] ${log.message}`)
    ),
    transports: [
        new winston.transports.Console()
    ]
});
