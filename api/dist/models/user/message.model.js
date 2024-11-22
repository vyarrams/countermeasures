"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// schema for conservation between 2 users
const messageSchema = new mongoose_1.default.Schema({
    conversation_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    sender: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    receiver: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    is_read: {
        type: Boolean,
        default: false
    },
    reply_to: {
        type: mongoose_1.default.Types.ObjectId,
        required: false,
    },
}, {
    timestamps: true
});
const message_model = mongoose_1.default.model('message', messageSchema);
exports.default = message_model;
