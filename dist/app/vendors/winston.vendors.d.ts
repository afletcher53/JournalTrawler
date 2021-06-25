import winston from 'winston';
export declare const levels: {
    error: number;
    warn: number;
    info: number;
    http: number;
    debug: number;
};
export declare const level: () => "debug" | "warn";
export declare const format: winston.Logform.Format;
export default levels;
//# sourceMappingURL=winston.vendors.d.ts.map