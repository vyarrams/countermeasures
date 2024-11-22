"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pitch_applicationSchema = new mongoose_1.default.Schema({
    pitch: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    applicant_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    roles: {
        type: [String],
        required: true
    },
    applicant_pitch: {
        type: String,
        required: false
    },
    is_viewed: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
const pitch_application_model = mongoose_1.default.model('pitch_application', pitch_applicationSchema);
exports.default = pitch_application_model;
