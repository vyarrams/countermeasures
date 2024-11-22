"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMail = void 0;
const constants_1 = require("../config/constants");
// Templates
const project_pdf_1 = require("../email_templates/project-pdf");
const welcome_mail = new project_pdf_1.ProjectPDF();
const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = constants_1.CONSTANTS.SEND_IN_BLUE_KEY;
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
const sender = { "name": "cofinds", "email": "noreply@cofinds.com" };
class SendMail {
    constructor() {
        this.sendTestMail = () => {
            const html = 'Test mail';
            sendSmtpEmail.subject = "Test mail | cofinds.com";
            sendSmtpEmail.htmlContent = html;
            sendSmtpEmail.sender = sender;
            sendSmtpEmail.to = [{ "email": 'siddhardhakancharla4@gmail.com', "name": 'Siddhardha' }];
            apiInstance.sendTransacEmail(sendSmtpEmail).then((data) => {
                console.log('API called successfully. Returned data: ' + data);
            }).catch((error) => {
                console.error(error);
            });
        };
        this.sendErrorAlert = (error) => {
            const html = `Error: ${error.toString()}`;
            sendSmtpEmail.subject = "Error Alert | Countermeasures App";
            sendSmtpEmail.htmlContent = html;
            sendSmtpEmail.sender = sender;
            sendSmtpEmail.to = [{ "email": 'hi.siddhardha@gmail.com', "name": 'Siddhardha' }];
            apiInstance.sendTransacEmail(sendSmtpEmail).then((data) => {
                console.log('API called successfully. Returned data: ' + data);
            }).catch((error) => {
                console.error(error);
            });
        };
    }
}
exports.SendMail = SendMail;
