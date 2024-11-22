"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const departmentSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: 'Department name is required'
    }
}, {
    timestamps: true
});
const department_model = mongoose_1.default.model('department', departmentSchema);
exports.default = department_model;
