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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const app_1 = __importDefault(require("./app"));
const http = __importStar(require("http"));
const https = __importStar(require("https"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, `../config/${process.env.ENVIRONMENT}.env`) });
var fs = require('fs');
const options = {
    key: fs.readFileSync("./cert/private.key"),
    cert: fs.readFileSync("./cert/certificate.crt")
};
let port1 = 80;
let port2 = 443;
let server1 = http.createServer(app_1.default).listen(port1, () => {
    console.log(`listening on ${port1}`);
    console.log(process.env.DATABASE);
});
let server2 = https.createServer(options, app_1.default).listen(port2, () => { console.log(`listening on ${port2}`); });
