import axiosBase from 'axios';
import { MessageEmbed } from 'discord.js';
import { logger } from "../logging";
import { getCurrentDateTime } from "../util";
require('dotenv').config();
const weatherApiKey = process.env.Weather_APIKEY
const weatherBaseurl = process.env.Weather_BASEURL

/**
 * 
 * @param conditionId https://openweathermap.org/weather-conditions
 */
function getWeatherStringByConditionId(conditionId: string): string {
    const id: number = parseInt(conditionId);
    if (id == 800) {
        return "晴れ";
    } else if (id > 800) {
        return "曇り";
    } else if (id >= 700 && id < 799) {
        switch (id) {
            case 701:
                return "霧";

            default:
                return "霧";
                break;
        }
    } else if (id >= 600 && id < 699) {
        return "雪";
    } else if (id >= 500 && id < 599) {
        return "雨";
    } else if (id >= 300 && id < 399) {
        return "小雨";
    } else if (id >= 200 && id < 299) {
        return "雷雨";
    } else {
        return "不明";
    }
}

/**
 * 
 * @param conditionId https://openweathermap.org/weather-conditions
 */
function getWeatherIconByIconId(iconId: string): string {
    return `http://openweathermap.org/img/wn/${iconId}.png`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCurrentWeather(cityId: string): Promise<any> {
    const axios = axiosBase.create({
        baseURL: process.env.GOOGLEHOME_NOTIFIER_URL,
        responseType: 'json'
    });
    const result = axios.get(`${weatherBaseurl}/weather?id=${cityId}&units=metric&lang=ja&Mode=json&appid=${weatherApiKey}`)
        .then(function (response) {
            logger.debug(JSON.stringify(response.data));
            const res = response.data;
            const message = res.name + "の現在の天気は" + getWeatherStringByConditionId(res.weather[0].id) + "、" + "気温は" + parseInt(res.main.temp).toFixed(1) + "度です。"
            logger.debug("Icon:" + getWeatherIconByIconId(res.weather[0].icon))
            const result: {[index: string]: string} =
            {
                message: message,
                icon: getWeatherIconByIconId(res.weather[0].icon)
            }
            logger.debug(JSON.stringify(result))
            return result;
        })
        .catch(function (error) {
            logger.error(JSON.stringify(error));
        });
    return result;
}
export const cityIdKitakata = process.env.Weather_CitiId_Kitakata
export const cityIdChiyoda = process.env.Weather_CitiId_Chiyoda

export function getCurrentWeatherAll(): Array<MessageEmbed> {
    const embeddedMessage1 = new MessageEmbed()
        .setTitle('天気情報: 喜多方市')
        .setColor("#6ad4f7")
        .setDescription(getCurrentDateTime())
        ;
    getCurrentWeather(cityIdKitakata).then(result =>{
        console.log(JSON.stringify(result));
        embeddedMessage1.addField('現在の天気', result.message);
        embeddedMessage1.setImage(result.icon);
    });
    const embeddedMessage2 = new MessageEmbed()
        .setTitle('天気情報: 文京区')
        .setColor("#6ad4f4")
        .setDescription(getCurrentDateTime())
        ;
     getCurrentWeather(cityIdChiyoda).then(result => {
        console.log(JSON.stringify(result));
        embeddedMessage2.addField('現在の天気', result.message);
        embeddedMessage2.setImage(result.icon);
    });
    return [embeddedMessage1, embeddedMessage2];
}
