import moment from 'moment';

export function getCurrentDateTime(): string {
    const currentTime = moment();
    return currentTime.format("YYYY/MM/DD/ HH:mm:ss");
}