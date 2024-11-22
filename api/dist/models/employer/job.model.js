"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const nanoid_1 = require("nanoid");
const jobSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        default: () => nanoid_1.nanoid(10),
        unique: true,
        trim: true,
    },
    position: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    company_name: {
        type: String,
        required: true,
        trim: true,
    },
    from_salary: {
        type: Number,
        required: false,
        trim: true,
    },
    to_salary: {
        type: Number,
        required: false,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    external_apply_url: {
        type: String,
        trim: true,
    },
    posted_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'employer',
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    likes: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'user',
        default: [],
    },
    admin_added: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});
const job_model = mongoose_1.default.model('job', jobSchema);
exports.default = job_model;
