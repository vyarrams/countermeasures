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
const bp = __importStar(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const path = __importStar(require("path"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./config/database"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const user_model_1 = __importDefault(require("./models/user/user.model"));
const encryption_1 = require("./functions/encryption");
const encryption = new encryption_1.Encryption();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const send_mail_1 = require("./functions/send_mail");
const send_mail = new send_mail_1.SendMail();
class Main {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.mongoConfig();
        this.routerConfig();
        // this.logs();
        this.loadStaticFilesConfig();
        // Configure Passport.js with Google Strategy
    }
    config() {
        this.app.use(bp.json());
        this.app.use(cors_1.default());
        // Configure session middleware
        this.app.use(session({
            secret: 'sid1234kancharla',
            resave: true,
            saveUninitialized: true,
        }));
        this.app.use(bp.urlencoded({ extended: false }));
        // this.app.use(limiter)
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
            res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type,Authorization');
            next();
        });
        // Passport serialization
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });
        passport.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findById(id);
                done(null, user);
            }
            catch (error) {
                done(error, false);
            }
        }));
    }
    mongoConfig() {
        const options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            // autoIndex: false, // Don't build indexes
            // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            // reconnectInterval: 5000, // Reconnect every 500ms
            poolSize: 100,
            // If not connected, return errors immediately rather than waiting for reconnect
            // bufferMaxEntries: 0,
            connectTimeoutMS: 100000,
            socketTimeoutMS: 900000, // Close sockets after 45 seconds of inactivity
            // replicaSet: 'rsMongoProd'
        };
        mongoose_1.default.connect(database_1.default.db, options);
        mongoose_1.default.Promise = global.Promise;
        mongoose_1.default.set('useFindAndModify', false);
        mongoose_1.default.connection.on('connected', () => {
            console.log('Connected to database');
            // logger.log('info', 'connected to database')
        });
        mongoose_1.default.connection.on('error', (err) => {
            console.log('mongoErr', err);
            // logger.error('mongoErr', err);
        });
    }
    routerConfig() {
        this.app.use('/user', user_route_1.default);
    }
    loadStaticFilesConfig() {
        this.app.use(express_1.default.static(path.join(__dirname, 'public')));
    }
}
exports.default = new Main().app;
