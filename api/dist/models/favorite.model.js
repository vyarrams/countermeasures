"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const favoriteSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    favorites: {
        type: [{ type: mongoose_1.default.Types.ObjectId, unique: true }],
        required: true,
        default: []
    }
}, {
    timestamps: true
});
const favorite_model = mongoose_1.default.model('favorite', favoriteSchema);
exports.default = favorite_model;
