"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hire_controller_1 = require("../controllers/hire.controller");
const auth_validate_1 = require("../middleware/auth-validate");
const router = express.Router();
const controller = new hire_controller_1.HireController();
const auth = new auth_validate_1.AuthValidate();
const constants_1 = require("../config/constants");
const admin_model_1 = __importDefault(require("../models/admin/admin.model"));
// **** AUTH **** //
router.post('/register', controller.registerEmployer);
router.post('/authenticate', controller.authenticate);
router.post('/change-password', auth.validate, controller.changePassword);
router.post('/check-email', controller.checkEmail);
router.post('/create-checkout-session', controller.createCheckoutSession);
router.post('/create-register-checkout-session', controller.createCheckoutSessionForRegistration);
router.post('/send-forgot-password-link', controller.sendForgotPasswordLink);
router.route('/check-password-reset-token/:token/:email').get(controller.checkPasswordResetToken);
router.route('/reset-password').post(controller.resetPassword);
// Jobs
router.post('/post-job', auth.validate, controller.postJob);
router.get('/get-jobs-of-employer/:employer_id', auth.validate, controller.getJobsOfEmployer);
// Set job application status
router.post('/set-job-application-status/:application_id', auth.validate, controller.setJobApplicationStatus);
router.get('/get-features', auth.validate, controller.getFeatures);
router.post('/add-feature', auth.validate, controller.addFeature);
router.post('/upvote-feature', auth.validate, controller.upvoteFeature);
router.post('/downvote-feature', auth.validate, controller.downvoteFeature);
router.post('/upgrade-to-lifetime', auth.validate, controller.upgradeToLifetime);
router.get('/get-subscription-status/:user_id', auth.validate, controller.getSubscriptionStatus);
router.delete('/delete-job/:job_id', auth.validate, controller.deleteJob);
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if Bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        // Next
        if (bearerToken) {
            jsonwebtoken_1.default.verify(req.token, constants_1.CONSTANTS.jwt_user_secret, (err, authData) => {
                if (err) {
                    res.status(403).json({ msg: err });
                }
                else {
                    const admin_id = authData.user._id;
                    admin_model_1.default.findById(admin_id, (er, admin) => {
                        if (er) {
                            res.status(403).json({ msg: er });
                        }
                        else {
                            if (admin.email === authData.user.email) {
                                next();
                            }
                            else {
                                res.status(403).json({ msg: 'Forbidden' });
                            }
                        }
                    });
                }
            });
        }
        else {
            res.json(403).json({ msg: 'Forbidden' });
        }
    }
    else {
        res.status(403).json('Forbidden');
    }
}
exports.default = router;
