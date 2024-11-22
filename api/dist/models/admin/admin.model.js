"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};
var validateMobile = function (mobile) {
    return /^\d{10}$/.test(mobile);
};
const adminSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please provide a valid email address']
    },
    password: {
        type: String,
        trim: true,
        required: 'Password is required',
        minlength: [6, 'Enter password with minimum 6 characters']
    },
}, {
    timestamps: true
});
const admin_model = mongoose_1.default.model('admin', adminSchema);
exports.default = admin_model;
