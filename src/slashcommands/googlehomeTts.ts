import axiosBase from 'axios';
import { logger } from "../logging";
require('dotenv').config();

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