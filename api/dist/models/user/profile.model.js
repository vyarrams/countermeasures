"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const nanoid_1 = require("nanoid");
const constants_1 = require("../../config/constants");
// Work experience schema
const work_experienceSchema = new mongoose_1.default.Schema({
    company_name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: false
    },
    currently_pursuing: {
        type: Boolean,
        required: false
    },
    end_date: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    remote: {
        type: Boolean,
        required: false
    },
}, {
    timestamps: true
});
// Education schema
const educationSchema = new mongoose_1.default.Schema({
    school_name: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: false
    },
    currently_pursuing: {
        type: Boolean,
        required: false
    },
    end_date: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});
// Resume profile
const profileSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: nanoid_1.nanoid(10)
    },
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    about: {
        type: String,
        required: false,
        default: ''
    },
    position: {
        type: String,
        required: true
    },
    profile_summary: {
        type: String,
        required: true
    },
    work_experience: {
        type: [work_experienceSchema],
        required: false,
        default: []
    },
    education: {
        type: [educationSchema],
        required: false,
        default: []
    },
    languages: {
        type: [String],
        required: false,
        default: []
    },
    country: {
        type: String,
        required: false
    },
    expected_salary: {
        type: Number,
        required: false
    },
    cover_image: {
        type: String,
        required: false
    },
    profile_image: {
        type: String,
        required: false,
        default: constants_1.CONSTANTS.default_user_image
    },
    resume_link: {
        type: String,
        required: false
    },
    skills: {
        type: [String],
        required: true,
        default: []
    },
    contact_email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    contact_phone: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
    employer_visits: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: 'employers',
        default: []
    },
    profile_views: {
        type: Number,
        default: 0
    },
    facebook: {
        type: String,
        required: false
    },
    twitter: {
        type: String,
        required: false
    },
    linkedin: {
        type: String,
        required: false
    },
    instagram: {
        type: String,
        required: false
    },
    github: {
        type: String,
        required: false
    },
    dribbble: {
        type: String,
        required: false
    },
    behance: {
        type: String,
        required: false
    },
    youtube: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});
const profile_model = mongoose_1.default.model('profile', profileSchema);
exports.default = profile_model;
