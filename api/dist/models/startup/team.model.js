"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const startup_teamSchema = new mongoose_1.default.Schema({
    startup_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    role: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
const startup_team_model = mongoose_1.default.model('startup_team', startup_teamSchema);
exports.default = startup_team_model;
