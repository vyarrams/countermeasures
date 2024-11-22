"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const page_visitSchema = new mongoose_1.default.Schema({
    page_title: {
        type: String,
        required: true
    },
    page_type: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: false
    },
    page_data: {
        type: Object,
        required: false
    }
}, {
    timestamps: true
});
const page_visit_model = mongoose_1.default.model('page_visit', page_visitSchema);
exports.default = page_visit_model;
