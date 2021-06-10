import serializer from '../validation/json.validation';

export function createErrorExists(value: String, name: String) {
  console.log(value, name)
  var error = new Error('A ' + name + ' already Exists with value = ' + value);
  error = serializer.serializeError(error);
  return error;
}

export function createErrorExistsCrossRef(value: String, name: String) {
  var error = new Error('A ' + name + ' doesnt exist in CrossRef with value = ' + value);
  error = serializer.serializeError(error);
  return error;
}


export function createErrorGeneric() {
    var error = new Error('An unknown error occured');
    error = serializer.serializeError(error);
    return error;
  }
  

