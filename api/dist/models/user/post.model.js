"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const comment_type = {
    user: {
        type: mongoose_1.default.Types.ObjectId
    },
    comment: {
        type: String,
    },
    likes: {
        type: [mongoose_1.default.Types.ObjectId],
        default: []
    }
};
const postSchema = new mongoose_1.default.Schema({
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
        required: 'Atleast one tag is required'
    },
    stage: {
        type: mongoose_1.default.Types.ObjectId,
        required: false,
    },
    country: {
        type: {},
    },
    city: {
        type: {},
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
        type: [comment_type],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});
const post = mongoose_1.default.model('post', postSchema);
exports.default = post;
