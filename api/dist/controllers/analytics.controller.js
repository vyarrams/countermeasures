"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const encryption_1 = require("../functions/encryption");
const send_mail_1 = require("../functions/send_mail");
const common_1 = require("../functions/common");
const pitch_share_model_1 = __importDefault(require("../models/analytics/pitch-share.model"));
const startup_share_model_1 = __importDefault(require("../models/analytics/startup-share.model"));
const btn_click_model_1 = __importDefault(require("../models/analytics/btn-click.model"));
const page_visit_model_1 = __importDefault(require("../models/analytics/page-visit.model"));
const pitch_views_model_1 = __importDefault(require("../models/analytics/pitch-views.model"));
const app_reference_model_1 = __importDefault(require("../models/analytics/app-reference.model"));
const encryption = new encryption_1.Encryption();
const send_mail = new send_mail_1.SendMail();
const common_functions = new common_1.CommonFunctions();
class AnalyticsController {
    constructor() {
        this.pitchShared = (req, res) => {
            pitch_share_model_1.default.create(req.body, (err, status) => {
                common_functions.sendErrorOrResult(err, status, res);
            });
        };
        this.startupShared = (req, res) => {
            startup_share_model_1.default.create(req.body, (err, status) => {
                common_functions.sendErrorOrResult(err, status, res);
            });
        };
        // Add btn click
        this.addBtnClick = (req, res) => {
            btn_click_model_1.default.create(req.body, (er, status) => {
                common_functions.sendErrorOrResult(er, status, res);
            });
        };
        // Add page visit
        this.addPageVisit = (req, res) => {
            page_visit_model_1.default.create(req.body, (er, status) => {
                common_functions.sendErrorOrResult(er, status, res);
            });
        };
        // Add pitch view
        this.addPitchView = (req, res) => {
            pitch_views_model_1.default.create(req.body, (er, status) => {
                common_functions.sendErrorOrResult(er, status, res);
            });
        };
        // Add app reference
        this.addAppReference = (req, res) => {
            app_reference_model_1.default.create(req.body, (er, status) => {
                common_functions.sendErrorOrResult(er, status, res);
            });
        };
    }
}
exports.AnalyticsController = AnalyticsController;
