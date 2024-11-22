"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pitch_viewSchema = new mongoose_1.default.Schema({
    pitch_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    view_type: {
        type: String,
        required: true,
        enum: ['popup', 'page']
    }
}, {
    timestamps: true
});
const pitch_view_model = mongoose_1.default.model('pitch_view', pitch_viewSchema);
exports.default = pitch_view_model;
