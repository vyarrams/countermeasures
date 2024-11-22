"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountUpgradedTemplate = void 0;
class AccountUpgradedTemplate {
    getTemplate(employer) {
        return `
            <h1>Hi ${employer.first_name},</h1>
            <p>Thank you for upgrading to a lifetime subscription. You will no longer be charged monthly.</p>
            <p>Thank you for choosing cofinds.com.</p>
            <p>Regards,</p>
            <a href="https://twitter.com/hi_siddhardha">Siddhardha Kancharla</a> <br>
            <a href="https://cofinds.com">cofinds.com</a>
          `;
    }
}
exports.AccountUpgradedTemplate = AccountUpgradedTemplate;
