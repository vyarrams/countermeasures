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
exports.HireController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
// import { Validators } from './common/validators';
const constants_1 = require("../config/constants");
const encryption_1 = require("../functions/encryption");
const stopwords_1 = require("../functions/stopwords");
const send_mail_1 = require("../functions/send_mail");
const common_1 = require("../functions/common");
// Models
const encryption = new encryption_1.Encryption();
const stop_words = new stopwords_1.StopWords();
const send_mail = new send_mail_1.SendMail();
const common = new common_1.CommonFunctions();
const reset_links_model_1 = __importDefault(require("../models/user/reset-links.model"));
const employer_model_1 = __importDefault(require("../models/employer/employer.model"));
const job_model_1 = __importDefault(require("../models/employer/job.model"));
const job_application_model_1 = __importDefault(require("../models/user/job-application.model"));
const feature_model_1 = __importDefault(require("../models/admin/feature.model"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, `../../config/${process.env.ENVIRONMENT}.env`) });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
class HireController {
    constructor() {
        this.checkEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const account = yield employer_model_1.default.findOne({ email: req.body.email });
            if (account) {
                return res.status(200).json({ message: 'Email already exists', status: false });
            }
            else {
                return res.status(200).json({ message: 'Email available', status: true });
            }
        });
        this.createCheckoutSession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Check if email already exists
            employer_model_1.default.findById(req.body.user_id).then((account) => __awaiter(this, void 0, void 0, function* () {
                if (account === null || account === void 0 ? void 0 : account.lifetime_subscription) {
                    return res.status(400).json({ message: 'Looks like you\'re already a lifetime subscriber' });
                }
                else {
                    const selected_plan_id = req.body.plan_id;
                    // Create stripe checkout session
                    const session = yield stripe.checkout.sessions.create({
                        line_items: [
                            {
                                price_data: {
                                    currency: 'usd',
                                    product_data: {
                                        name: 'Lifetime Subscription',
                                        description: 'Lifetime Subscription. No monthly fees. No hidden fees. No contracts.',
                                    },
                                    unit_amount: 500 * 100,
                                },
                                quantity: 1,
                            },
                        ],
                        mode: 'payment',
                        success_url: `${process.env.LOCAL_URL}payment-success`,
                        cancel_url: process.env.LOCAL_URL + 'payment-cancelled',
                    });
                    res.json({ id: session.id });
                }
            })).catch((error) => {
                return res.status(500).json(error);
            });
        });
        this.createCheckoutSessionForRegistration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Check if email already exists
            employer_model_1.default.find({ email: req.body.email }).then((account) => __awaiter(this, void 0, void 0, function* () {
                if (account.length > 0) {
                    return res.status(400).json({ message: 'Looks like you\'re already registered. Please login to continue.' });
                }
                else {
                    // Create stripe checkout session
                    const session = yield stripe.checkout.sessions.create({
                        line_items: [
                            {
                                price_data: {
                                    currency: 'usd',
                                    product_data: {
                                        name: 'Lifetime Subscription',
                                        description: 'Lifetime Subscription. No monthly fees. No hidden fees. No contracts.',
                                    },
                                    unit_amount: 500 * 100,
                                },
                                quantity: 1,
                            },
                        ],
                        mode: 'payment',
                        success_url: `${process.env.LOCAL_URL}register-payment-success`,
                        cancel_url: process.env.LOCAL_URL + 'register-payment-cancelled',
                    });
                    res.json({ id: session.id });
                }
            })).catch((error) => {
                console.log(error);
                return res.status(500).json(error);
            });
        });
        this.upgradeToLifetime = (req, res) => __awaiter(this, void 0, void 0, function* () {
            employer_model_1.default.findByIdAndUpdate(req.body.user_id, { lifetime_subscription: true, payment_date: new Date() }, { new: true }).then((account) => __awaiter(this, void 0, void 0, function* () {
                send_mail.lifetimeSubscription(account);
                return res.status(200).json({ message: 'Successfully upgraded to lifetime subscription', account: account });
            })).catch((error) => {
                return res.status(500).json(error);
            });
        });
        this.getSubscriptionStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            employer_model_1.default.findById(req.params.user_id, { lifetime_subscription: 1, payment_date: 1 }, { new: true }, (er, account) => {
                common.sendErrorOrResult(er, account, res);
            });
        });
        this.registerEmployer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            employer_model_1.default.findOne({
                email: req.body.email
            }, (error, employer) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return res.status(500).json(error);
                }
                if (employer) {
                    return res.status(400).json({ message: 'Email already exists' });
                }
                encryption.encryptUserPassword(req.body.password, (hash) => __awaiter(this, void 0, void 0, function* () {
                    const new_employer = new employer_model_1.default({
                        _id: new mongoose_1.default.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        lifetime_subscription: req.body.lifetime_subscription ? true : false,
                        payment_date: req.body.lifetime_subscription ? new Date() : null,
                    });
                    new_employer.save((er, employer) => __awaiter(this, void 0, void 0, function* () {
                        if (er) {
                            return res.status(500).json(er);
                        }
                        encryption.employerGenerateJSONtokenForRegistration(employer, res);
                    }));
                }));
            }));
        });
        this.authenticate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const password = req.body.password;
            employer_model_1.default.findOne({ email: email }, (er, record) => {
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
        });
        this.sendForgotPasswordLink = (req, res) => {
            const email = req.body.email;
            employer_model_1.default.findOne({ email: email }, (er, user_data) => {
                if (er) {
                    res.status(constants_1.CONSTANTS.http_codes.INTERNAL_ERROR).json(er);
                }
                else if (!user_data) {
                    res.status(constants_1.CONSTANTS.http_codes.INTERNAL_ERROR).json('Email is not registered with us');
                }
                else {
                    const token = encryption.userGeneratePasswordResetToken(email, res);
                    const link = constants_1.CONSTANTS.employer_password_reset_base_url + '?email=' + email + '&token=' + token;
                    console.log(link);
                    reset_links_model_1.default.create({ email: email, token: token }, (er, status) => {
                        if (er) {
                            res.status(constants_1.CONSTANTS.http_codes.INTERNAL_ERROR).json(er);
                        }
                        else {
                            send_mail.sendPasswordResetToken(email, link, res);
                        }
                    });
                }
            });
        };
        this.checkPasswordResetToken = (req, res) => {
            const token = req.params.token;
            const email = req.params.email;
            reset_links_model_1.default.findOne({ email: email, token: token }, (er, token_data) => {
                if (er) {
                    res.status(constants_1.CONSTANTS.http_codes.INTERNAL_ERROR).json(er);
                }
                else if (!token_data) {
                    res.status(constants_1.CONSTANTS.http_codes.INTERNAL_ERROR).json('Invalid token');
                }
                else {
                    res.json(true);
                }
            });
        };
        this.resetPassword = (req, res) => {
            const email = req.body.email;
            const password = req.body.password;
            encryption.encryptUserPassword(password, (hash) => {
                employer_model_1.default.findOneAndUpdate({ email: email }, { $set: { password: hash } }, {}, (er, status) => {
                    if (er) {
                        res.status(constants_1.CONSTANTS.http_codes.INTERNAL_ERROR).json(er);
                    }
                    else {
                        reset_links_model_1.default.deleteMany({ email: email }).exec();
                        res.json(status);
                    }
                });
            });
        };
        this.changePassword = (req, res) => {
            const user_id = req.body.user_id;
            const old_password = req.body.old_password;
            const new_password = req.body.new_password;
            employer_model_1.default.findById(user_id, (er, user) => {
                if (er) {
                    res.status(500).json(er);
                }
                else {
                    encryption.comparePasswords(old_password, user.password, (matched) => {
                        if (matched) {
                            // encrypt and add new password
                            encryption.encryptUserPassword(new_password, (hash) => {
                                employer_model_1.default.findByIdAndUpdate(user_id, { $set: { password: hash } }, (err, status) => {
                                    if (err) {
                                        res.status(500).json(err);
                                    }
                                    else {
                                        res.json(status);
                                    }
                                });
                            });
                        }
                        else {
                            // Throw error
                            res.status(500).json('Password is incorrect');
                        }
                    });
                }
            });
        };
        this.postJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const employer = req.body.posted_by;
            employer_model_1.default.findById(employer, (er, user) => __awaiter(this, void 0, void 0, function* () {
                if (er) {
                    res.status(500).json(er);
                }
                if (!user.lifetime_subscription) {
                    // Check if employer posted 2 jobs
                    const jobs = yield job_model_1.default.find({ posted_by: employer });
                    if (jobs.length >= 2) {
                        return res.status(500).json({ message: 'You can only post 2 jobs' });
                    }
                    else {
                        job_model_1.default.create(req.body, (error, job) => {
                            common.sendErrorOrResult(error, job, res);
                        });
                    }
                }
                else {
                    job_model_1.default.create(req.body, (error, job) => {
                        common.sendErrorOrResult(error, job, res);
                    });
                }
            }));
        });
        this.deleteJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Delete job and all applications
            job_model_1.default.findByIdAndDelete(req.params.job_id, {}, (error, job) => {
                if (error) {
                    res.status(500).json(error);
                }
                else {
                    job_application_model_1.default.deleteMany({ job: job._id }).exec();
                    res.json(job);
                }
            });
        });
        this.getJobsOfEmployer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Jobs of employer with applications
            job_model_1.default.aggregate([
                {
                    $match: {
                        posted_by: mongoose_1.default.Types.ObjectId(req.params.employer_id)
                    }
                },
                {
                    $lookup: {
                        from: 'job_applications',
                        localField: '_id',
                        foreignField: 'job',
                        as: 'applications'
                    }
                },
                {
                    $lookup: {
                        from: 'profiles',
                        localField: 'applications.profile',
                        foreignField: '_id',
                        as: 'applicants'
                    }
                },
            ], (error, jobs) => {
                common.sendErrorOrResult(error, jobs, res);
            });
        });
        this.setJobApplicationStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            job_application_model_1.default.findByIdAndUpdate(req.params.application_id, { application_status: req.body.status }, (error, application) => {
                common.sendErrorOrResult(error, application, res);
            });
        });
        this.addFeature = (req, res) => {
            console.log(req.body.added_by);
            employer_model_1.default.findById(req.body.added_by, (er, user) => {
                if (er) {
                    return res.status(500).json(er);
                }
                if (!user) {
                    return res.status(500).json({ message: 'User not found' });
                }
                if (user.lifetime_subscription) {
                    feature_model_1.default.create(req.body, (er, status) => {
                        common.sendErrorOrResult(er, status, res);
                    });
                }
                else {
                    return res.status(500).json({ message: 'You need to upgrade to lifetime subscription to add a feature' });
                }
            });
        };
        this.getFeatures = (req, res) => {
            feature_model_1.default.find((er, features) => {
                common.sendErrorOrResult(er, features, res);
            });
        };
        this.upvoteFeature = (req, res) => {
            // Remove downvote and add upvote
            feature_model_1.default.findByIdAndUpdate(req.body.feature_id, { $pull: { downvotes: req.body.user_id }, $push: { upvotes: req.body.user_id } }, { upsert: true }, (er, status) => {
                common.sendErrorOrResult(er, status, res);
            });
        };
        this.downvoteFeature = (req, res) => {
            // Remove upvote and add downvote
            feature_model_1.default.findByIdAndUpdate(req.body.feature_id, { $pull: { upvotes: req.body.user_id }, $push: { downvotes: req.body.user_id } }, { upsert: true }, (er, status) => {
                common.sendErrorOrResult(er, status, res);
            });
        };
    }
}
exports.HireController = HireController;
