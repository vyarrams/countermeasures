"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// schema for conversation between 2 users
const conversationSchema = new mongoose_1.default.Schema({
    users: {
        type: [mongoose_1.default.Types.ObjectId],
        required: true
    },
    status: {
        type: String,
        required: true,
        default: true
    }
}, {
    timestamps: true
});
const conversation_model = mongoose_1.default.model('conversation', conversationSchema);
exports.default = conversation_model;
