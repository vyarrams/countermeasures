import { CONSTANTS } from '../config/constants';


// Templates
import { ProjectPDF } from '../email_templates/project-pdf';




const welcome_mail = new ProjectPDF();


const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = CONSTANTS.SEND_IN_BLUE_KEY;
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
const sender = { "name": "cofinds", "email": "noreply@cofinds.com" };


export class SendMail {

    sendTestMail = () => {
        const html = 'Test mail';
        sendSmtpEmail.subject = "Test mail | cofinds.com";
        sendSmtpEmail.htmlContent = html;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [{ "email": 'siddhardhakancharla4@gmail.com', "name": 'Siddhardha' }];
        apiInstance.sendTransacEmail(sendSmtpEmail).then((data: any) => {
            console.log('API called successfully. Returned data: ' + data);
        }).catch((error: any) => {
            console.error(error);
        });

    }
    sendErrorAlert = (error: any) => {
        const html = `Error: ${error.toString()}`;
        sendSmtpEmail.subject = "Error Alert | Countermeasures App";
        sendSmtpEmail.htmlContent = html;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [{ "email": 'hi.siddhardha@gmail.com', "name": 'Siddhardha' }];
        apiInstance.sendTransacEmail(sendSmtpEmail).then((data: any) => {
            console.log('API called successfully. Returned data: ' + data);
        }).catch((error: any) => {
            console.error(error);
        });
    }





}