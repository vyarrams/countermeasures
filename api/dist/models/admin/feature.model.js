"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const featureSchema = new mongoose_1.default.Schema({
    added_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
    },
    feature: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    admin_added: {
        type: Boolean,
        default: false
    },
    upvotes: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: []
    },
    downvotes: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        default: []
    },
    status: {
        type: String,
        default: 'suggested',
        enum: ['suggested', 'planned', 'in-progress', 'live']
    },
    release_date: {
        type: Date,
        required: false
    },
}, {
    timestamps: true
});
const feature_model = mongoose_1.default.model('feature', featureSchema);
exports.default = feature_model;
