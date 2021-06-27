/**
 * Function to extract date from the axios response.
 * @param articleData
 * @returns Two strings
 */


const getDate = (articleData) => {
  console.log(articleData.message)
  if (typeof articleData.message['published-online'] !== 'undefined') {
    //Set day to one if not provided
    if (!articleData.message['published-online']['date-parts'][0][2]) {
      var daytum = 1;
    } else {
      daytum = articleData.message['published-online']['date-parts'][0][2];
    }
    var publishedOnlineDate = new Date(Date.UTC(articleData.message['published-online']['date-parts'][0][0], (articleData.message['published-online']['date-parts'][0][1] - 1), daytum));
  }

  if (typeof articleData.message['published-print'] !== 'undefined') {
    if (!articleData.message['published-print']['date-parts'][0][2]) {
      var ppdaytum = 1;
    } else {
      ppdaytum = articleData.message['published-print']['date-parts'][0][2];
    }
    var publishedPrintDate = new Date(Date.UTC(articleData.message['published-print']['date-parts'][0][0], (articleData.message['published-print']['date-parts'][0][1] - 1), ppdaytum));
  }
  return { publishedPrintDate, publishedOnlineDate };
};

export default getDate;
