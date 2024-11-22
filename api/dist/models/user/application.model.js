"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const applicationSchema = new mongoose_1.default.Schema({
    post_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    roles: {
        type: [String],
        required: true
    },
    comment: {
        type: String,
        required: false
    },
    contact: {
        type: String
    },
    document: {
        type: String,
        required: false
    },
    favorite: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});
applicationSchema.index({ post_id: 1, user_id: 1 }, { unique: true });
const application = mongoose_1.default.model('application', applicationSchema);
exports.default = application;
