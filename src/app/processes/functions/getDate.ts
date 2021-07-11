/**
 * Function to extract date from the axios response.
 * @param articleData
 * @returns Two strings
 */

const getDate = (articleData) => {
  if (typeof articleData.message['published-online'] !== 'undefined') {
    if (!articleData.message['published-online']['date-parts'][0][2]) {
      var day = 1;
    } else {
      day = articleData.message['published-online']['date-parts'][0][2];
    }

    if (articleData.message['published-online']['date-parts'][0][1]) {
      var month = articleData.message['published-online']['date-parts'][0][1];
    } else {
      month = 1;
    }

    if (articleData.message['published-online']['date-parts'][0][0]) {
      var year = Number(
        articleData.message['published-online']['date-parts'][0][0] - 1
      );
    } else {
      year = 1;
    }
    var publishedOnlineDate = new Date(Date.UTC(year, month, day));
  }

  if (typeof articleData.message['published-print'] !== 'undefined') {
    if (!articleData.message['published-print']['date-parts'][0][2]) {
      var day = 1;
    } else {
      day = articleData.message['published-print']['date-parts'][0][2];
    }

    if (articleData.message['published-print']['date-parts'][0][1]) {
      var month = articleData.message['published-print']['date-parts'][0][1];
    } else {
      month = 1;
    }

    if (articleData.message['published-print']['date-parts'][0][0]) {
      var year = Number(
        articleData.message['published-print']['date-parts'][0][0] - 1
      );
    } else {
      year = 1;
    }
    var publishedPrintDate = new Date(Date.UTC(year, month, day));
  }
  return { publishedPrintDate, publishedOnlineDate };
};

export default getDate;
