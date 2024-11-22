"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stageSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required',
        unique: true
    },
    description: {
        type: String,
        trim: true,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});
const stage = mongoose_1.default.model('stage', stageSchema);
exports.default = stage;
