import chai from 'chai';
import { cityIdChiyoda, getCurrentWeather, getCurrentWeatherAll } from '../src/slashcommands/weatherReport';

describe('getCurrentWeather', () => {
    it("should return", () => {
        const result = getCurrentWeather(cityIdChiyoda);
        chai.assert.exists(result);
        console.log(JSON.stringify(result));
    });
});


describe('getCurrentWeatherAll', () => {
    it("should return", () => {
        const result = getCurrentWeatherAll();
        chai.assert.exists(result);
        console.log(JSON.stringify(result));
    });
});