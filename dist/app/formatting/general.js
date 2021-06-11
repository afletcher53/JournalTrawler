"use strict";
/**
 * Function to return a models schema items as an array
 * @param {Model} Model - Mongoose model schema
 * @return {array} array containing all model schema items
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemaList = void 0;
const createSchemaList = (Model) => {
    const array = [];
    array.push('id');
    Model.schema.eachPath(function (path) {
        path.startsWith('_') ? null : array.push(path);
    });
    return array;
};
exports.createSchemaList = createSchemaList;
//# sourceMappingURL=general.js.map