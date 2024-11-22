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
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const upload_1 = require("../middleware/upload");
const auth_validate_1 = require("../middleware/auth-validate");
const router = express.Router();
const userController = new user_controller_1.UserController();
const validate = new auth_validate_1.AuthValidate().validate;
const admin_validate = new auth_validate_1.AuthValidate().admin_validate;
router.route('/login').post(userController.login);
router.route('/authenticate').post(userController.login);
router.route('/register').post(userController.register);
router.route('/change-password').post(validate, userController.changePassword);
router.route('/send-verification-email/:id').get(userController.sendEmailVerificationLink);
router.route('/get-user-by-id/:id').get(validate, userController.getUserById);
router.route('/update-user').post(admin_validate, userController.updateUser);
// getAllUsers
router.route('/get-all-users').get(admin_validate, userController.getAllUsers);
// get-all-projects
router.route('/get-all-projects').get(admin_validate, userController.getAllProjects);
// add-project
router.route('/add-project').post(validate, upload_1.uploadProjectDocument.single('uploaded_document'), userController.addProject);
// router.route('/add-project').post(validate, userController.addProject);
// deleteProject
router.route('/delete-project/:id').delete(validate, userController.deleteProject);
// update-project/${id}
router.route('/update-project/:id').put(validate, upload_1.uploadProjectDocument.single('uploaded_document'), userController.updateProject);
// router.route('/update-project/:id').put(validate, userController.updateProject);
// 
// deleteUploadedDocument
router.route('/delete-uploaded-document/:id').delete(validate, userController.deleteUploadedDocument);
router.route('/upload-project-document/:id').post(upload_1.uploadProjectDocument.single('file'), userController.uploadProjectDocument);
// getAllFilterData
router.route('/get-all-filter-data').get(validate, userController.getAllFilterData);
// get-project/${id}
router.route('/get-project/:id').get(validate, userController.getProject);
// download-project-pdf/${id}
router.route('/download-project-pdf/:id').get(userController.downloadProjectPdf);
// get-agent-projects/${id}
router.route('/get-agent-projects/:id').get(validate, userController.getAgentProjects);
// get-view-only-projects/${id}
router.route('/get-view-only-projects/:id').get(validate, userController.getViewOnlyProjects);
// add-department
router.route('/add-department').post(admin_validate, userController.addDepartment);
// get-all-departments
router.route('/get-all-departments').get(validate, userController.getDepartments);
// update department
router.route('/update-department/:id').put(admin_validate, userController.updateDepartment);
// deleteDepartment
router.route('/delete-department/:id').delete(admin_validate, userController.deleteDepartment);
// assignUserToDepartment
router.route('/assign-user-to-department').post(admin_validate, userController.assignUserToDepartment);
// tempUpdateData
router.route('/temp-update-data').post(upload_1.mem_upload.single('data_file'), userController.tempUpdateData);
exports.default = router;
