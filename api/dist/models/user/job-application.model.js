"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const job_applicationSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    profile: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'profile'
    },
    job: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    cover_letter: {
        type: String,
        required: false,
        default: ''
    },
    application_status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'shortlisted', 'rejected', 'hired']
    }
}, {
    timestamps: true
});
const job_application_model = mongoose_1.default.model('job_application', job_applicationSchema);
exports.default = job_application_model;
// User and job unique index
job_applicationSchema.index({ profile: 1, job: 1 }, { unique: true });
