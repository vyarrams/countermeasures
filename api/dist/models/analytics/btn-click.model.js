"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const btn_clickSchema = new mongoose_1.default.Schema({
    page: {
        type: String,
        required: true
    },
    page_type: {
        type: String,
        required: false
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: false
    },
    button: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
const btn_click_model = mongoose_1.default.model('btn_click', btn_clickSchema);
exports.default = btn_click_model;
