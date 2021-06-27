/// <reference types="qs" />
import express from 'express';
declare const _default: {
    create: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>) => Promise<express.Response<any, Record<string, any>>>;
    update: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>) => express.Response<any, Record<string, any>>;
    findAll: (req: any, res: express.Response<any, Record<string, any>>) => void;
    findOne: (req: any, res: express.Response<any, Record<string, any>>) => express.Response<any, Record<string, any>>;
    deleteOne: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>) => void;
    deleteAll: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>) => void;
    findAllPublished: (req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>) => void;
};
export default _default;
//# sourceMappingURL=article.controller.d.ts.map