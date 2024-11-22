"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const investor_verification_codeSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    is_used: {
        type: Boolean,
        default: false
    },
    used_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
}, {
    timestamps: true
});
const investor_verification_code_model = mongoose_1.default.model('investor_verification_code', investor_verification_codeSchema);
exports.default = investor_verification_code_model;
