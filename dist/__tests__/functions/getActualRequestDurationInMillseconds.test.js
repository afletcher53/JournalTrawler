"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getActualRequestDurationInMilliseconds_1 = __importDefault(require("../../middleware/functions/getActualRequestDurationInMilliseconds"));
describe('Convert Request Duration into Milliseconds', () => {
    test('it should return a number', () => {
        const input = [580, 482458694];
        expect(typeof getActualRequestDurationInMilliseconds_1.default(input)).toBe('number');
    });
});
