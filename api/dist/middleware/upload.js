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
exports.uploadProjectDocument = exports.mem_upload = void 0;
const aws = __importStar(require("aws-sdk"));
const path = __importStar(require("path"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const nanoid_1 = require("nanoid");
aws.config.loadFromPath('s3.json');
const s3 = new aws.S3();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path.resolve(__dirname, `../../config/${process.env.ENVIRONMENT}.env`) });
const bucket = 'countermeasures-svaapta';
exports.mem_upload = multer_1.default({ storage: multer_1.default.memoryStorage() });
exports.uploadProjectDocument = multer_1.default({
    storage: multer_s3_1.default({
        s3: s3,
        bucket: bucket,
        // @ts-ignore
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        // @ts-ignore
        key: function (req, file, cb) {
            const fileName = nanoid_1.nanoid(10).toString() + path.extname(file.originalname);
            const new_path = 'projects/' + fileName;
            cb(null, new_path);
        }
    })
});
