"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../../config/constants");
const startupSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    what_we_do: {
        type: String,
        required: true
    },
    elevator_pitch: {
        type: String,
        required: false
    },
    pitches: {
        type: [mongoose_1.default.Types.ObjectId],
        required: false,
    },
    industry: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true,
        default: constants_1.CONSTANTS.default_cover_image
    },
    website: {
        type: String,
        required: false
    },
    funding_stage: {
        type: String,
        required: false
    },
    amount_raised: {
        type: String,
        required: false
    },
    contact_email: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    mission_statement: {
        type: String,
        required: false
    },
    problem_statement: {
        type: String,
        required: false
    },
    target_market: {
        type: String,
        required: false
    },
    product_stage: {
        type: String,
        required: false
    },
    usp: {
        type: String,
        required: false
    },
    revenue_model: {
        type: String,
        required: false
    },
    current_traction: {
        type: String,
        required: false
    },
    future_plans: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        required: false,
        default: []
    },
    team_size: {
        type: Number,
        required: false
    },
    tech_stack: {
        type: [String],
        required: false,
        default: []
    },
    milestones: {
        type: [{
                title: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                },
                date: {
                    type: Date,
                    required: false
                },
            }],
        required: false,
        default: []
    },
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    likes: {
        type: [mongoose_1.default.Types.ObjectId],
        default: []
    },
    saves: {
        type: [mongoose_1.default.Types.ObjectId],
        default: []
    },
    social_media: {
        type: {
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
            youtube: {
                type: String,
                required: false
            },
            github: {
                type: String,
                required: false
            },
            website: {
                type: String,
                required: false
            },
            other: {
                type: String,
                required: false
            }
        },
        required: false,
        default: {}
    }
}, {
    timestamps: true
});
const startup_model = mongoose_1.default.model('startup', startupSchema);
exports.default = startup_model;
