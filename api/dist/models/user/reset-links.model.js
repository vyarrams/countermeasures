"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const resetLinkSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    token: {
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
const reset_link_model = mongoose_1.default.model('resetLink', resetLinkSchema);
exports.default = reset_link_model;
