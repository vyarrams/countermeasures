"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const email_verificationSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        trim: true,
    },
    token: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
const email_verification_model = mongoose_1.default.model('email_verification', email_verificationSchema);
exports.default = email_verification_model;
