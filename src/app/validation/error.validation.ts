import serializer from '../validation/json.validation';

export function createErrorExists(value: string, name: string) {
  let error = new Error(`A  ${name}  already Exists with value = ${value}`);
  error = serializer.serializeError(error);
  return error;
}

export function createErrorExistsCrossRef(value: string, name: string) {
  let error = new Error(`A  ${name}  doesnt exists on crossref with value = ${value}`);
  error = serializer.serializeError(error);
  return error;
}


export function createErrorGeneric() {
  let error = new Error('An unknown error occured');
  error = serializer.serializeError(error);
  return error;
}


