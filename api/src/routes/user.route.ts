import * as express from 'express';
import { UserController } from '../controllers/user.controller';
import { mem_upload, uploadProjectDocument } from '../middleware/upload';

import { AuthValidate } from '../middleware/auth-validate';
const router = express.Router();
const userController = new UserController();

const validate = new AuthValidate().validate;
const admin_validate = new AuthValidate().admin_validate;



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
router.route('/add-project').post(validate, uploadProjectDocument.single('uploaded_document'), userController.addProject);
// router.route('/add-project').post(validate, userController.addProject);

// deleteProject
router.route('/delete-project/:id').delete(validate, userController.deleteProject);

// update-project/${id}
router.route('/update-project/:id').put(validate, uploadProjectDocument.single('uploaded_document'), userController.updateProject);
// router.route('/update-project/:id').put(validate, userController.updateProject);
// 

// deleteUploadedDocument
router.route('/delete-uploaded-document/:id').delete(validate, userController.deleteUploadedDocument);
router.route('/upload-project-document/:id').post(uploadProjectDocument.single('file'), userController.uploadProjectDocument);

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
router.route('/temp-update-data').post(mem_upload.single('data_file'), userController.tempUpdateData);


export default router;