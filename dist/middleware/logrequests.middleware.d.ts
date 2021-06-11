import { NextFunction, Request, Response } from 'express';
/**
 * Middleware to log requests to the systemLogger
 * @param req Express request
 * @param res Express response
 * @param next Express NextFunction
 */
declare const logRequests: (req: Request, res: Response, next: NextFunction) => void;
export default logRequests;
//# sourceMappingURL=logrequests.middleware.d.ts.map