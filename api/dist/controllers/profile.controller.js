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
exports.ProfileController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const encryption_1 = require("../functions/encryption");
const stopwords_1 = require("../functions/stopwords");
const send_mail_1 = require("../functions/send_mail");
const common_1 = require("../functions/common");
const encryption = new encryption_1.Encryption();
const stop_words = new stopwords_1.StopWords();
const send_mail = new send_mail_1.SendMail();
const common_functions = new common_1.CommonFunctions();
const profile_model_1 = __importDefault(require("../models/user/profile.model"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, `../../config/${process.env.ENVIRONMENT}.env`) });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
class ProfileController {
    constructor() {
        this.getUserProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user_id = req.params.user_id;
            const profile = yield profile_model_1.default.findOne({ user: user_id });
            if (!profile) {
                return res.status(200).json({ message: 'Profile not found', profile: null });
            }
            return res.status(200).json({ profile });
        });
        this.updateUserProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user_id = req.params.user_id;
            // Check if profile exists
            const profile = yield profile_model_1.default.findOne({ user: user_id });
            req.body.work_experience ? req.body.work_experience = JSON.parse(req.body.work_experience) : req.body.work_experience = [];
            req.body.education ? req.body.education = JSON.parse(req.body.education) : req.body.education = [];
            // req.body.languages string to array of strings trim spaces
            req.body.languages ? req.body.languages = req.body.languages.split(',') : req.body.languages = [];
            // trim spaces from languages
            req.body.languages = req.body.languages.map((lang) => lang.trim());
            // req.body.skills string to array of strings
            req.body.skills ? req.body.skills = req.body.skills.split(',') : req.body.skills = [];
            // trim spaces from skills
            req.body.skills = req.body.skills.map((skill) => skill.trim());
            if (req.file || req.files) {
                // @ts-ignore
                req.body.profile_image = req.file.location;
            }
            if (!profile) {
                // Create profile
                const new_profile = new profile_model_1.default(Object.assign({ user: user_id }, req.body));
                const save = yield new_profile.save().then((data) => {
                    return res.status(200).json({ message: 'Profile created', profile: data });
                }).catch((err) => {
                    return res.status(500).json({ message: 'Error creating profile', profile: null, error: err });
                });
            }
            else {
                // Update profile
                const update = yield profile_model_1.default.findOneAndUpdate({ user: user_id }, req.body, { new: true }).then((data) => {
                    return res.status(200).json({ message: 'Profile updated', profile: data });
                }).catch((err) => {
                    return res.status(500).json({ message: 'Error updating profile', profile: null, error: err });
                });
            }
        });
        // Public profile
        this.getProfileFromUsername = (req, res) => {
            const username = req.params.username;
            profile_model_1.default.findOne({ username: username }, (er, user) => {
                common_functions.sendErrorOrResult(er, user, res);
            });
        };
        this.incrementProfileViews = (req, res) => {
            console.log('inc');
            profile_model_1.default.findByIdAndUpdate(req.params.id, { $inc: { profile_views: 1 } }, { new: true }, (er, user) => {
                common_functions.sendErrorOrResult(er, user, res);
            });
        };
    }
}
exports.ProfileController = ProfileController;
