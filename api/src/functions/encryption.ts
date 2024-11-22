import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user_model from '../models/user/user.model';

import { CONSTANTS } from '../config/constants';
import { SendMail } from '../functions/send_mail';
import { nanoid } from 'nanoid';
const send_mail = new SendMail();

export class Encryption {
    public encryptUserPassword = (password: string, callback: any) => {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) { throw err; }
            else {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                        throw err;
                    }
                    else {
                        callback(hash);
                    }
                });
            }
        });
    }

    public userGenerateJSONtoken = (user: any, res: any) => {
        jwt.sign({ user: user }, CONSTANTS.jwt_user_secret, { expiresIn: "60d" }, (er, token) => {
            if (er) {
                res.status(500).json(er);
            }
            else {
                res.json({
                    success: true,
                    user: user,
                    token: token,
                });
            }
        });
    }

    public returnUserToken = (user: any): any => {
        jwt.sign({ user: user }, CONSTANTS.jwt_user_secret, { expiresIn: "60d" }, (er, token) => {
            if (er) {
                return { success: false, error: er }
            }
            else {
                return { success: true, user: user, token: token }
            }
        });
    }

    public userGeneratePasswordResetToken = (email: any, res: any) => {
        return nanoid();
    }

    public userGenerateJSONtokenForRegistration = (user: any, res: any) => {
        jwt.sign({ user: user }, CONSTANTS.jwt_user_secret, { expiresIn: "60d" }, (er, token) => {
            if (er) {
                res.status(500).json(er);
            }
            else {
                res.json({
                    success: true,
                    user: user,
                    token: token,
                });
            }
        });
    }

    public employerGenerateJSONtokenForRegistration = (user: any, res: any) => {
        jwt.sign({ user: user }, CONSTANTS.jwt_user_secret, { expiresIn: "60d" }, (er, token) => {
            if (er) {
                res.status(500).json(er);
            }
            else {
                // send_mail.sendWelcomeMail(user, token as string);
                res.json({
                    success: true,
                    user: user,
                    token: token,
                });
            }
        });
    }

    public userGenerateJSONtokenForResendVerification = (user: any, res: any) => {
        jwt.sign({ user: user }, CONSTANTS.jwt_user_secret, { expiresIn: "60d" }, (er, token) => {
            if (er) {
                res.status(500).json(er);
            }
            else {
                res.json({
                    success: true,
                });
            }
        });
    }

    public comparePasswords = (password: string, old_password: string, callback: any) => {
        bcrypt.compare(password, old_password, (err: any, match: any) => {
            if (err) throw err;
            callback(match);
        });
    }
}