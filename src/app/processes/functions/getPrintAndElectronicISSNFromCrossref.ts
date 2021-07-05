/**
 * Return print / electronic ISSN.
 * @param issnObject Object given by CrossRef API
 * @returns issn of Print/Electronic, null if not available - String
 */
const getPrintAndElectronicISSN = (issnObject: Object) => {
  let printISSN: string, electronicISSN: string;
  issnObject['issn-type'].forEach((element: { type: string; value: any }) => {
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

export default getPrintAndElectronicISSN;
