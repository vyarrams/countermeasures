"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const startup_shareSchema = new mongoose_1.default.Schema({
    startup_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: false
    },
    platform: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const startup_share_model = mongoose_1.default.model('startup_share', startup_shareSchema);
exports.default = startup_share_model;
