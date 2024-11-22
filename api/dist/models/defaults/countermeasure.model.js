"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const countermeasureSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required',
        unique: true
    },
    pros: {
        type: [],
        trim: true,
        required: 'Pros are required'
    },
    cons: {
        type: [],
        trim: true,
        required: 'Cons are required'
    },
    category: {
        type: String,
        trim: true,
        required: false
    },
    ref_value: {
        type: Number,
        trim: true,
        required: true
    }
}, {
    timestamps: true
});
const countermeasure_model = mongoose_1.default.model('countermeasure', countermeasureSchema);
exports.default = countermeasure_model;
