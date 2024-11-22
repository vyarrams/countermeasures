"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
// import { Validators } from './common/validators';
const constants_1 = require("../config/constants");
const encryption_1 = require("../functions/encryption");
// Models
const user_model_1 = __importDefault(require("../models/user/user.model"));
const encryption = new encryption_1.Encryption();
class AuthController {
    constructor() {
        this.authenticate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const password = req.body.password;
            user_model_1.default.findOne({ email: email }, (er, record) => {
                if (record) {
                    encryption.comparePasswords(password, record.password, (matched) => {
                        if (matched) {
                            encryption.userGenerateJSONtoken(record, res);
                        }
                        else {
                            res.status(constants_1.CONSTANTS.http_codes.BAD_REQUEST).json('Wrong Password');
                        }
                    });
                }
                else {
                    res.status(constants_1.CONSTANTS.http_codes.NOT_FOUND).json('No user found');
                }
            });
        });
    }
}
exports.AuthController = AuthController;
