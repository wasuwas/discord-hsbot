import chai from 'chai';
import { getCurrentDateTime } from '../src/util';

describe('getCurrentTime', () => {
    it("should return", () => {
        const currentTime = getCurrentDateTime();
        console.log(currentTime);
        chai.assert.exists(currentTime);
    });
});