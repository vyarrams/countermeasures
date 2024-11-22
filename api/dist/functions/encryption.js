"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../config/constants");
const send_mail_1 = require("../functions/send_mail");
const nanoid_1 = require("nanoid");
const send_mail = new send_mail_1.SendMail();
class Encryption {
    constructor() {
        this.encryptUserPassword = (password, callback) => {
            bcryptjs_1.default.genSalt(10, function (err, salt) {
                if (err) {
                    throw err;
                }
                else {
                    bcryptjs_1.default.hash(password, salt, function (err, hash) {
                        if (err) {
                            throw err;
                        }
                        else {
                            callback(hash);
                        }
                    });
                }
            });
        };
        this.userGenerateJSONtoken = (user, res) => {
            jsonwebtoken_1.default.sign({ user: user }, constants_1.CONSTANTS.jwt_user_secret, { expiresIn: "60d" }, (er, token) => {
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
        };
        this.returnUserToken = (user) => {
            jsonwebtoken_1.default.sign({ user: user }, constants_1.CONSTANTS.jwt_user_secret, { expiresIn: "60d" }, (er, token) => {
                if (er) {
                    return { success: false, error: er };
                }
                else {
                    return { success: true, user: user, token: token };
                }
            });
        };
        this.userGeneratePasswordResetToken = (email, res) => {
            return nanoid_1.nanoid();
        };
        this.userGenerateJSONtokenForRegistration = (user, res) => {
            jsonwebtoken_1.default.sign({ user: user }, constants_1.CONSTANTS.jwt_user_secret, { expiresIn: "60d" }, (er, token) => {
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
        };
        this.employerGenerateJSONtokenForRegistration = (user, res) => {
            jsonwebtoken_1.default.sign({ user: user }, constants_1.CONSTANTS.jwt_user_secret, { expiresIn: "60d" }, (er, token) => {
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
        };
        this.userGenerateJSONtokenForResendVerification = (user, res) => {
            jsonwebtoken_1.default.sign({ user: user }, constants_1.CONSTANTS.jwt_user_secret, { expiresIn: "60d" }, (er, token) => {
                if (er) {
                    res.status(500).json(er);
                }
                else {
                    res.json({
                        success: true,
                    });
                }
            });
        };
        this.comparePasswords = (password, old_password, callback) => {
            bcryptjs_1.default.compare(password, old_password, (err, match) => {
                if (err)
                    throw err;
                callback(match);
            });
        };
    }
}
exports.Encryption = Encryption;
