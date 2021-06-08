const serializer = require('../validation/json.validation');
function createErrorExists(value, name) {
    console.log(value, name);
    var error = new Error('A ' + name + ' already Exists with value = ' + value);
    error = serializer.serializeError(error);
    return error;
}
function createErrorExistsCrossRef(value, name) {
    var error = new Error('A ' + name + ' doesnt exist in CrossRef with value = ' + value);
    error = serializer.serializeError(error);
    return error;
}
function createErrorGeneric() {
    var error = new Error('An unknown error occured');
    error = serializer.serializeError(error);
    return error;
}
module.exports.createErrorExists = createErrorExists;
module.exports.createErrorExistsCrossRef = createErrorExistsCrossRef;
module.exports.createErrorGeneric = createErrorGeneric;
