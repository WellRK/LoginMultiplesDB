export default class NumberUtil {
    static generateRandomNumber() {
        return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    }

    static generateRandomNumberForSMS() {
        return Math.floor(Math.random() * (99 - 10 + 1)) + 10;
    }

    static generateRandomNumberArbitrary(min, max): number {
        return Math.random() * (max - min) + min;
    }
}