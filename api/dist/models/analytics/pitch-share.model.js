"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pitch_shareSchema = new mongoose_1.default.Schema({
    pitch_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: false
    },
    platform: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const pitch_share_model = mongoose_1.default.model('pitch_share', pitch_shareSchema);
exports.default = pitch_share_model;
