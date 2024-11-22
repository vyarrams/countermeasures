"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../config/constants");
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
var validateMobile = function (mobile) {
    return /^\d{10}$/.test(mobile);
};
const userSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        trim: true,
        required: 'First name is required'
    },
    last_name: {
        type: String,
        trim: true,
        required: 'Lastname is required'
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please provide a valid email address']
    },
    bio: {
        type: String,
        required: false
    },
    password: {
        type: String,
        trim: true,
        required: 'Password is required',
        minlength: [6, 'Enter password with minimum 6 characters']
    },
    image: {
        type: Object,
        default: { location: constants_1.CONSTANTS.default_user_image }
    },
    subscribed_tags: {
        type: [String],
        default: []
    },
    emails: {
        type: Boolean,
        default: true
    },
    email_verified: {
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
const user_model = mongoose_1.default.model('user', userSchema);
exports.default = user_model;
