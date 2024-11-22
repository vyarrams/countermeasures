"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const constants_1 = require("../config/constants");
// import { Timeline } from '../controllers/functions/timeline';
// const timeline = new Timeline();
// Models
const user_model_1 = __importDefault(require("../models/user/user.model"));
const stage_model_1 = __importDefault(require("../models/stage.model"));
const encryption_1 = require("../functions/encryption");
const send_mail_1 = require("../functions/send_mail");
const admin_model_1 = __importDefault(require("../models/admin/admin.model"));
const feedback_model_1 = __importDefault(require("../models/admin/feedback.model"));
const pitch_model_1 = __importDefault(require("../models/user/pitch.model"));
const feature_model_1 = __importDefault(require("../models/admin/feature.model"));
const common_1 = require("../functions/common");
const encryption = new encryption_1.Encryption();
const send_mail = new send_mail_1.SendMail();
const common_functions = new common_1.CommonFunctions();
class AdminController {
    constructor() {
        // *** AUTH **** //
        this.register = (req, res) => {
            try {
                encryption.encryptUserPassword(req.body.password, (hash) => {
                    req.body.password = hash;
                    req.body.email = req.body.email.toLowerCase();
                    admin_model_1.default.create(req.body, (err, status) => {
                        if (err) {
                            res.status(constants_1.CONSTANTS.http_codes.INTERNAL_ERROR).json(err);
                        }
                        else {
                            encryption.userGenerateJSONtokenForRegistration(status, res);
                        }
                    });
                });
            }
            catch (error) {
                res.status(constants_1.CONSTANTS.http_codes.INTERNAL_ERROR).json(error);
            }
        };
        this.authenticate = (req, res) => {
            const email = req.body.email;
            const password = req.body.password;
            admin_model_1.default.findOne({ email: email }, (er, record) => {
                if (record) {
                    encryption.comparePasswords(password, record.password, (matched) => {
                        if (matched) {
                            encryption.userGenerateJSONtoken(record, res);
                        }
                        else {
                            res.status(constants_1.CONSTANTS.http_codes.BAD_REQUEST).json('Wrong Password');
                        }
                    });
                }
                else {
                    res.status(constants_1.CONSTANTS.http_codes.NOT_FOUND).json('No user found');
                }
            });
        };
        // **** FEEDBACK **** //
        this.getFeedback = (req, res) => {
            feedback_model_1.default.find({}, null, { sort: { createdAt: -1 } }, (er, feedback_data) => {
                if (er) {
                    res.status(500).json(er);
                }
                else {
                    res.json(feedback_data);
                }
            });
        };
        // **** POSTS **** //
        this.getPosts = (req, res) => {
            pitch_model_1.default.aggregate([
                { $match: { isActive: true } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $sort: { createdAt: -1 } },
            ], (er, posts) => {
                if (er) {
                    res.status(500).json(er);
                }
                else {
                    res.json(posts);
                }
            });
        };
        this.editPost = (req, res) => {
            pitch_model_1.default.findByIdAndUpdate(req.body.id, { $set: req.body }, { upsert: true }, (er, status) => {
                if (er) {
                    res.status(500).json(er);
                }
                else {
                    res.json(status);
                }
            });
        };
        // **** STAGES **** //
        this.addStage = (req, res) => {
            const stage = new stage_model_1.default(req.body);
            stage.save((er, status) => {
                if (er) {
                    res.status(500).json(er);
                }
                else {
                    res.json(status);
                }
            });
        };
        this.getStages = (req, res) => {
            stage_model_1.default.find((er, stages_data) => {
                if (er) {
                    res.status(500).json(er);
                }
                else {
                    res.json(stages_data);
                }
            });
        };
        this.getUsers = (req, res) => {
            user_model_1.default.aggregate([
                {
                    $sort: { createdAt: -1 }
                }
            ], (er, users_data) => {
                if (er) {
                    res.status(500).json(er);
                }
                else {
                    res.json(users_data);
                }
            });
        };
        this.addFeature = (req, res) => {
            feature_model_1.default.create(req.body, (er, status) => {
                common_functions.sendErrorOrResult(er, status, res);
            });
        };
        this.getFeatures = (req, res) => {
            feature_model_1.default.find((er, features) => {
                common_functions.sendErrorOrResult(er, features, res);
            });
        };
        this.upvoteFeature = (req, res) => {
            // Remove downvote and add upvote
            feature_model_1.default.findByIdAndUpdate(req.body.id, { $pull: { downvotes: req.body.user_id }, $push: { upvotes: req.body.user_id } }, { upsert: true }, (er, status) => {
                common_functions.sendErrorOrResult(er, status, res);
            });
        };
        this.downvoteFeature = (req, res) => {
            // Remove upvote and add downvote
            feature_model_1.default.findByIdAndUpdate(req.body.id, { $pull: { upvotes: req.body.user_id }, $push: { downvotes: req.body.user_id } }, { upsert: true }, (er, status) => {
                common_functions.sendErrorOrResult(er, status, res);
            });
        };
    }
}
exports.AdminController = AdminController;
