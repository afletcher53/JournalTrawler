"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrintAndElectronicISSN = void 0;
/**
 * Return print / electronic ISSN.
 * @param issnObject Object given by CrossRef API
 * @returns issn of Print/Electronic, null if not available - String
 */
const getPrintAndElectronicISSN = (issnObject) => {
    let printISSN, electronicISSN;
    console.log(issnObject);
    issnObject['issn-type'].forEach((element) => {
        if (printISSN == undefined)
            printISSN = element.type == 'print' ? printISSN = String(element.value) : null;
        if (electronicISSN == undefined)
            electronicISSN = element.type == 'electronic' ? electronicISSN = String(element.value) : null;
    });
    return {
        printISSN,
        electronicISSN
    };
};
exports.getPrintAndElectronicISSN = getPrintAndElectronicISSN;
