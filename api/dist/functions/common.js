"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonFunctions = void 0;
const constants_1 = require("../config/constants");
const send_mail_1 = require("./send_mail");
const send_mail = new send_mail_1.SendMail();
class CommonFunctions {
    constructor() {
        this.sendErrorOrResult = (error, result, res) => {
            if (error) {
                send_mail.sendErrorAlert(error);
                res.status(constants_1.CONSTANTS.http_codes.INTERNAL_ERROR).json(error);
            }
            else {
                res.json(result);
            }
        };
        this.exportToCsv = (data, fields, filename) => {
        };
    }
}
exports.CommonFunctions = CommonFunctions;
