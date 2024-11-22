import { json, Request, Response } from 'express';
import { CONSTANTS } from '../config/constants';
import { SendMail } from './send_mail';
const send_mail = new SendMail();




export class CommonFunctions {
    public sendErrorOrResult = (error: any, result: any, res: Response) => {
        if (error) {
            send_mail.sendErrorAlert(error);
            res.status(CONSTANTS.http_codes.INTERNAL_ERROR).json(error);
        } else {
            res.json(result);
        }
    }

    public exportToCsv = (data: any, fields: any, filename: string) => {

    }

}
