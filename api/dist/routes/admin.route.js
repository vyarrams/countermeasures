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
const admin_controller_1 = require("../controllers/admin.controller");
const router = express.Router();
const adminController = new admin_controller_1.AdminController();
const constants_1 = require("../config/constants");
const admin_model_1 = __importDefault(require("../models/admin/admin.model"));
// **** AUTH **** //
router.route('/authenticate').post(adminController.authenticate);
// **** FEEDBACK **** //
router.route('/get-feedback').get(verifyToken, adminController.getFeedback);
// **** GET POSTS **** //
router.route('/get-posts').get(verifyToken, adminController.getPosts);
router.route('/edit-post').post(verifyToken, adminController.editPost);
// **** STAGES **** //
router.route('/add-stage').post(verifyToken, adminController.addStage);
router.route('/get-stages').get(verifyToken, adminController.getStages);
router.route('/get-users').get(verifyToken, adminController.getUsers);
router.post('/add-feature', verifyToken, adminController.addFeature);
router.get('/get-features', verifyToken, adminController.getFeatures);
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
