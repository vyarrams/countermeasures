"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidate = void 0;
const constants_1 = require("../config/constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthValidate {
    constructor() {
        this.validate = (req, res, next) => {
            const bearerHeader = req.headers['authorization'];
            // Check if Bearer is undefined
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];
                req.token = bearerToken;
                // Next
                if (bearerToken) {
                    jsonwebtoken_1.default.verify(req.token, constants_1.CONSTANTS.jwt_user_secret, (err, authData) => {
                        if (err) {
                            res.status(401).json(err);
                        }
                        else {
                            next();
                        }
                    });
                }
                else {
                    res.status(401).json('Invalid token');
                }
            }
            else {
                res.status(401).json('Empty token');
            }
        };
        this.admin_validate = (req, res, next) => {
            const bearerHeader = req.headers['authorization'];
            // Check if Bearer is undefined
            if (typeof bearerHeader !== 'undefined') {
                const bearer = bearerHeader.split(' ');
                const bearerToken = bearer[1];
                req.token = bearerToken;
                // Next
                if (bearerToken) {
                    jsonwebtoken_1.default.verify(req.token, constants_1.CONSTANTS.jwt_user_secret, (err, authData) => {
                        var _a;
                        if (err) {
                            res.status(401).json(err);
                        }
                        else {
                            // if authData.is_admin is true then only allow
                            if ((_a = authData === null || authData === void 0 ? void 0 : authData.user) === null || _a === void 0 ? void 0 : _a.is_admin) {
                                next();
                            }
                            else {
                                res.status(401).json('Unauthorized');
                            }
                        }
                    });
                }
                else {
                    res.status(401).json('Invalid token');
                }
            }
            else {
                res.status(401).json('Empty token');
            }
        };
    }
}
exports.AuthValidate = AuthValidate;
