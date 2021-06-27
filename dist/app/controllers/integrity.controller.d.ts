/// <reference types="qs" />
import express from 'express';
declare const _default: {
    findAll: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>) => Promise<void>;
    createISSNforDOI: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>) => Promise<express.Response<any, Record<string, any>>>;
    createISSNforAllMissing: (req: any, res: any) => Promise<void>;
    createISSNforMissing: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>) => Promise<express.Response<any, Record<string, any>>>;
    updateISSN: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>) => Promise<express.Response<any, Record<string, any>>>;
    findOne: (req: any, res: any) => void;
    findAllViaISSN: (req: any, res: any) => Promise<any>;
    deleteAll: (req: any, res: any) => void;
    updateAllISSN: (req: any, res: any) => Promise<void>;
};
export default _default;
//# sourceMappingURL=integrity.controller.d.ts.map