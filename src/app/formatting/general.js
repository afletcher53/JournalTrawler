/**
 * Function to return a models schema items as an array
 * @param {Model} Model - Mongoose model schema
 * @return {array} array containing all model schema items
 */


const createSchemaList = (Model) => {
  const array = [];
  array.push('id');
  Model.schema.eachPath(function(path) {
      path.startsWith('_') ? null : array.push(path);
  });
  return array;
};


module.exports.createSchemaList = createSchemaList;

