"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    added_by: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Feedback', 'Questions', 'Support', 'Collaboration', 'Investor Interest', 'Networking', 'Other'],
        default: 'Other'
    },
    likes: {
        type: [mongoose_1.default.Types.ObjectId],
        default: []
    }
}, {
    timestamps: true
});
const pitchSchema = new mongoose_1.default.Schema({
    pitch: {
        type: String,
        trim: true,
        unique: true
    },
    roles: {
        type: [String],
        required: 'Roles are required'
    },
    tags: {
        type: [String],
        required: 'At least one tag is required'
    },
    stage: {
        type: String,
        required: false,
        enum: ['Idea', 'Prototype', 'MVP', 'Beta', 'Launched', 'In Profit', 'Other', 'Generating Revenue'],
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    likes: {
        type: [mongoose_1.default.Types.ObjectId],
        default: []
    },
    comments: {
        type: [commentSchema],
        default: []
    },
    saves: {
        type: [mongoose_1.default.Types.ObjectId],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startup: {
        type: mongoose_1.default.Types.ObjectId,
        required: false
    }
}, {
    timestamps: true
});
const pitch_model = mongoose_1.default.model('pitch', pitchSchema);
exports.default = pitch_model;
