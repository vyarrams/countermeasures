"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reset_otpSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});
const reset_otp_model = mongoose_1.default.model('reset_otp', reset_otpSchema);
exports.default = reset_otp_model;
