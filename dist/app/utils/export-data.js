"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const system_logger_1 = __importDefault(require("../loggers/system.logger"));
const mongoose_service_1 = require("../requests/mongoose.service");
/**
 * Generates backups of all the mongoose collection models
 */
const exportData = async () => {
    const ts = Date.now();
    const dateOb = new Date(ts);
    const date = dateOb.getDate();
    const month = dateOb.getMonth() + 1;
    const year = dateOb.getFullYear();
    const directory = 'data';
    fs_1.default.readdir(directory, (err, files) => {
        if (err) {
            throw err;
        }
        for (const file of files) {
            fs_1.default.unlink(path_1.default.join(directory, file), (unlinkErr) => {
                if (unlinkErr) {
                    throw unlinkErr;
                }
            });
        }
    });
    Promise.all(
    // Delete all previous backups
    [mongoose_service_1.mongoFetchAllArticles().then((data) => {
            const sendData = JSON.stringify(data);
            const fileName = `data/backup_Article_${year}-${month}-${date}.csv`;
            fs_1.default.writeFile(fileName, sendData, function (error) {
                if (error) {
                    system_logger_1.default.error(error);
                }
                system_logger_1.default.info(`Backup to  ${fileName} was a success`);
            });
        }),
        mongoose_service_1.mongoFetchAllJournals().then((data) => {
            const sendData = JSON.stringify(data);
            const fileName = `data/backup_Journal_${year}-${month}-${date}.csv`;
            fs_1.default.writeFile(fileName, sendData, function (error) {
                if (error) {
                    system_logger_1.default.error(error);
                }
                system_logger_1.default.info(`Backup to  ${fileName} was a success`);
            });
        }),
        mongoose_service_1.mongoFetchAllIntegrities().then((data) => {
            const sendData = JSON.stringify(data);
            const fileName = `data/backup_Integrities_${year}-${month}-${date}.csv`;
            fs_1.default.writeFile(fileName, sendData, function (error) {
                if (error) {
                    system_logger_1.default.error(error);
                }
                system_logger_1.default.info(`Backup to  ${fileName} was a success`);
            });
        })]);
};
exports.default = exportData;
