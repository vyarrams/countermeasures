"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartupController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const startup_model_1 = __importDefault(require("../models/startup/startup.model"));
const pitch_model_1 = __importDefault(require("../models/user/pitch.model"));
const common_1 = require("../functions/common");
const user_model_1 = __importDefault(require("../models/user/user.model"));
const send_mail_1 = require("../functions/send_mail");
const send_mail = new send_mail_1.SendMail();
const common = new common_1.CommonFunctions();
class StartupController {
    constructor() {
        // Get startup by username
        this.getStartupByUsername = (req, res) => {
            startup_model_1.default.aggregate([
                {
                    $match: { username: req.params.username }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
            ], (er, docs) => {
                common.sendErrorOrResult(er, docs, res);
            });
        };
        this.getPitchesByStartupId = (req, res) => {
            pitch_model_1.default.aggregate([
                {
                    $match: { startup: mongoose_1.default.Types.ObjectId(req.params.id) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user_data'
                    }
                },
                {
                    $lookup: {
                        from: 'stages',
                        localField: 'stage',
                        foreignField: '_id',
                        as: 'stages_data'
                    }
                },
                {
                    $lookup: {
                        from: 'startups',
                        localField: 'startup',
                        foreignField: '_id',
                        as: 'startup_data'
                    }
                },
                // sort by date
                {
                    $sort: { createdAt: -1 }
                },
            ], (er, docs) => {
                common.sendErrorOrResult(er, docs, res);
            });
        };
        this.likeStartup = (req, res) => {
            // Push if unique
            startup_model_1.default.findByIdAndUpdate(req.body.startup_id, { $push: { likes: req.body.user_id } }, { upsert: true }, (err, startup) => {
                common.sendErrorOrResult(err, startup, res);
            });
        };
        this.unlikeStartup = (req, res) => {
            startup_model_1.default.findByIdAndUpdate(req.body.startup_id, { $pull: { likes: req.body.user_id } }, { upsert: true }, (err, startup) => {
                common.sendErrorOrResult(err, startup, res);
            });
        };
        this.saveStartup = (req, res) => {
            startup_model_1.default.findByIdAndUpdate(req.body.startup_id, { $push: { saves: req.body.user_id } }, { upsert: true }, (err, startup) => {
                common.sendErrorOrResult(err, startup, res);
            });
        };
        this.unsaveStartup = (req, res) => {
            startup_model_1.default.findByIdAndUpdate(req.body.startup_id, { $pull: { saves: req.body.user_id } }, { upsert: true }, (err, startup) => {
                common.sendErrorOrResult(err, startup, res);
            });
        };
        this.getStartUpFollowers = (req, res) => {
            user_model_1.default.find({ followed_startups: req.params.id }, (err, users) => {
                common.sendErrorOrResult(err, users, res);
            });
        };
    }
    createStartup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.files || req.file) {
                    // @ts-ignore
                    req.files.logo ? req.body.logo = req.files.logo[0].location : null;
                    // @ts-ignore
                    req.files.cover ? req.body.cover = req.files.cover[0].location : null;
                }
                req.body.pitches ? req.body.pitches = JSON.parse(req.body.pitches) : null;
                req.body.tags ? req.body.tags = JSON.parse(req.body.tags) : null;
                req.body.tech_stack ? req.body.tech_stack = JSON.parse(req.body.tech_stack) : null;
                req.body.social_media ? req.body.social_media = JSON.parse(req.body.social_media) : null;
                const startup = yield new startup_model_1.default(req.body).save();
                // Update pitches with startup id
                pitch_model_1.default.updateMany({ _id: { $in: startup.pitches } }, { startup: startup._id }).then((res) => {
                });
                res.status(200).json(startup);
            }
            catch (err) {
                send_mail.sendErrorAlert(err);
                res.status(500).json(err);
            }
        });
    }
    updateStartup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.files || req.file) {
                // @ts-ignore
                req.files.logo ? req.body.logo = req.files.logo[0].location : null;
                // @ts-ignore
                req.files.cover ? req.body.cover = req.files.cover[0].location : null;
            }
            req.body.pitches ? req.body.pitches = JSON.parse(req.body.pitches) : null;
            req.body.tags ? req.body.tags = JSON.parse(req.body.tags) : null;
            req.body.tech_stack ? req.body.tech_stack = JSON.parse(req.body.tech_stack) : null;
            req.body.social_media ? req.body.social_media = JSON.parse(req.body.social_media) : null;
            startup_model_1.default.findByIdAndUpdate(req.body._id, req.body, { upsert: true }, (err, startup) => {
                // Update pitches with startup id
                pitch_model_1.default.updateMany({ _id: { $in: startup.pitches } }, { startup: startup._id }).then((res) => {
                });
                common.sendErrorOrResult(err, startup, res);
            });
        });
    }
    getStartup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                startup_model_1.default.aggregate([
                    {
                        $match: { _id: mongoose_1.default.Types.ObjectId(req.params.id) }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'user_id',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $lookup: {
                            from: 'pitches',
                            localField: 'pitches',
                            foreignField: '_id',
                            as: 'pitches_data'
                        }
                    }
                ], (er, docs) => {
                    common.sendErrorOrResult(er, docs[0], res);
                });
            }
            catch (err) {
                send_mail.sendErrorAlert(err);
                res.status(500).json(err);
            }
        });
    }
    getStartupsOfUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            startup_model_1.default.find({ user_id: req.params.user_id }, (err, startups) => {
                common.sendErrorOrResult(err, startups, res);
            });
        });
    }
}
exports.StartupController = StartupController;
