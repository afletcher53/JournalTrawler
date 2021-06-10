import serializer from '../../validation/json.validation';
import db from '../../models';
const Journal = db.journals;

/**
 * function to find a journal based on ISSN string
 * @param {String} issn of the journal to be found
 * @param {axios} res res to be sent
 */
export function findJournal(issn, res) {
  Journal.find({$or: [{issn_electronic: issn}, {issn_print: issn}]})
      .then((data) => {
        if (data.length == 0) {
          res.status(404).send(
              {message: 'Not found Journal with issn ' + issn});
        } else {
          res.send(serializer.serialize('journal', data));
        }
      })
      .catch((err) => {
        res
            .status(500)
            .send({message: 'Error retrieving Journal with id=' + issn});
      });
}
