"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const target_crash_typeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required',
        unique: true
    },
    countermeasures: {
        type: [Number],
        trim: true,
        required: false
    },
}, {
    timestamps: true
});
const target_crash_type_model = mongoose_1.default.model('target_crash_type', target_crash_typeSchema);
exports.default = target_crash_type_model;
