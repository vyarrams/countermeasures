"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employerSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    lifetime_subscription: {
        type: Boolean,
        default: false
    },
    payment_id: {
        type: String,
        default: null
    },
    payment_date: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
const employer_model = mongoose_1.default.model('employer', employerSchema);
exports.default = employer_model;
