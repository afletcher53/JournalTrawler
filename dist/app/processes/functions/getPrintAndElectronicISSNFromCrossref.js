"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPrintAndElectronicISSN = (issnObject) => {
    let printISSN, electronicISSN;
    issnObject['issn-type'].forEach((element) => {
        if (printISSN === undefined) {
            printISSN =
                element.type === 'print' ? (printISSN = String(element.value)) : null;
        }
        if (electronicISSN === undefined) {
            electronicISSN =
                element.type === 'electronic'
                    ? (electronicISSN = String(element.value))
                    : null;
        }
    });
    return {
        printISSN,
        electronicISSN
    };
};
exports.default = getPrintAndElectronicISSN;
