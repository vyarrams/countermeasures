"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_referenceSchema = new mongoose_1.default.Schema({
    route: {
        type: String,
        required: true
    },
    ref: {
        type: String,
        required: true
    },
    context: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});
const app_reference_model = mongoose_1.default.model('app_reference', app_referenceSchema);
exports.default = app_reference_model;
