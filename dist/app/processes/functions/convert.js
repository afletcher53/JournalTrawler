"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convert = (obj, articleCount) => {
    return Object.keys(obj).map((key) => ({
        name: key,
        value: obj[key],
        percentage: Number((obj[key] / articleCount) * 100)
    }));
};
exports.default = convert;
