"use strict";
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
exports.UserController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
// import { Validators } from './common/validators';
const constants_1 = require("../config/constants");
const encryption_1 = require("../functions/encryption");
const stopwords_1 = require("../functions/stopwords");
const send_mail_1 = require("../functions/send_mail");
const common_1 = require("../functions/common");
const puppeteer = require('puppeteer');
// Models
const user_model_1 = __importDefault(require("../models/user/user.model"));
const encryption = new encryption_1.Encryption();
const stop_words = new stopwords_1.StopWords();
const send_mail = new send_mail_1.SendMail();
const common_functions = new common_1.CommonFunctions();
const project_model_1 = __importDefault(require("../models/user/project.model"));
const roadway_area_type_model_1 = __importDefault(require("../models/defaults/roadway-area-type.model"));
const roadway_classification_model_1 = __importDefault(require("../models/defaults/roadway-classification.model"));
const focus_area_model_1 = __importDefault(require("../models/defaults/focus-area.model"));
const aadtvv_model_1 = __importDefault(require("../models/defaults/aadtvv.model"));
const problems_to_be_addressed_model_1 = __importDefault(require("../models/defaults/problems-to-be-addressed.model"));
const countermeasure_model_1 = __importDefault(require("../models/defaults/countermeasure.model"));
const target_crash_type_model_1 = __importDefault(require("../models/defaults/target-crash-type.model"));
const project_pdf_1 = require("../email_templates/project-pdf");
const department_model_1 = __importDefault(require("../models/user/department.model"));
const xlsx_1 = __importDefault(require("xlsx"));
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, `../../config/${process.env.ENVIRONMENT}.env`) });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
class UserController {
    constructor() {
        this.tempUpdateData = (req, res) => {
            // console.log(req.body.file);
            console.log('Hello');
            res.json('Hello');
            console.log(req.body);
            console.log(req.file);
            const workbook = xlsx_1.default.read(req.file.buffer, { type: 'buffer' });
            const sheetNames = workbook.SheetNames;
            const firstSheetName = sheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const data = xlsx_1.default.utils.sheet_to_json(worksheet);
            data.forEach((row) => {
                const id = row.id;
                const pros_content = row.PROS;
                const pros_array = pros_content.split('\n');
                const cons_content = row.CONS;
                const cons_array = cons_content.split('\n');
                const update_object = { pros: pros_array, cons: cons_array };
                console.log('Updating', id, update_object);
                countermeasure_model_1.default.findByIdAndUpdate(id, { $set: update_object }, (er, docs) => {
                    console.log(er, docs);
                });
            });
        };
        // **** USER **** //
        this.register = (req, res) => {
            try {
                encryption.encryptUserPassword(req.body.password, (hash) => {
                    req.body.password = hash;
                    req.body.email = req.body.email.toLowerCase();
                    user_model_1.default.create(req.body, (err, status) => {
                        if (err) {
                            res.status(constants_1.CONSTANTS.http_codes.INTERNAL_ERROR).json(err);
                        }
                        else {
                            encryption.userGenerateJSONtokenForRegistration(status, res);
                        }
                    });
                });
            }
            catch (error) {
                res.status(constants_1.CONSTANTS.http_codes.INTERNAL_ERROR).json(error);
            }
        };
        this.login = (req, res) => {
            const email = req.body.email;
            const password = req.body.password;
            user_model_1.default.findOne({ email: email }, (er, record) => {
                if (record) {
                    encryption.comparePasswords(password, record.password, (matched) => {
                        if (matched) {
                            encryption.userGenerateJSONtoken(record, res);
                        }
                        else {
                            res.status(constants_1.CONSTANTS.http_codes.BAD_REQUEST).json('Wrong Password');
                        }
                    });
                }
                else {
                    res.status(constants_1.CONSTANTS.http_codes.NOT_FOUND).json('No user found');
                }
            });
        };
        this.sendEmailVerificationLink = (req, res) => {
            const user_id = req.params.id;
            user_model_1.default.findById(user_id, (er, docs) => {
                if (er) {
                    send_mail.sendErrorAlert(er);
                    res.status(500).json(er);
                }
                else {
                    const user = docs;
                    encryption.userGenerateJSONtokenForResendVerification(user, res);
                }
            });
        };
        this.getAllUsers = (req, res) => {
            user_model_1.default.aggregate([
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'assigned_departments',
                        foreignField: '_id',
                        as: 'departments'
                    }
                }
            ], (er, docs) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        };
        this.getAllProjects = (req, res) => {
            project_model_1.default.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'added_by',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'last_edited_by',
                        foreignField: '_id',
                        as: 'last_edited_by_data'
                    }
                },
            ], (er, docs) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        };
        // getAgentProjects
        this.getAgentProjects = (req, res) => {
            // get departments of user
            user_model_1.default.findById(req.params.id, (er, user) => {
                if (er) {
                    send_mail.sendErrorAlert(er);
                    res.status(500).json(er);
                }
                else {
                    const departments = user.assigned_departments;
                    project_model_1.default.aggregate([
                        {
                            $match: { department: { $in: departments } }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'added_by',
                                foreignField: '_id',
                                as: 'user'
                            }
                        },
                        {
                            $lookup: {
                                from: 'departments',
                                localField: 'department',
                                foreignField: '_id',
                                as: 'department'
                            }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'last_edited_by',
                                foreignField: '_id',
                                as: 'last_edited_by_data'
                            }
                        },
                    ], (er, docs) => {
                        common_functions.sendErrorOrResult(er, docs, res);
                    });
                }
            });
        };
        // getViewOnlyProjects
        this.getViewOnlyProjects = (req, res) => {
            // get departments of user
            user_model_1.default.findById(req.params.id, (er, user) => {
                if (er) {
                    send_mail.sendErrorAlert(er);
                    res.status(500).json(er);
                }
                else {
                    const departments = user.assigned_departments;
                    project_model_1.default.aggregate([
                        {
                            $match: { department: { $in: departments }, is_published: true }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'added_by',
                                foreignField: '_id',
                                as: 'user'
                            }
                        },
                        {
                            $lookup: {
                                from: 'departments',
                                localField: 'department',
                                foreignField: '_id',
                                as: 'department'
                            }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'last_edited_by',
                                foreignField: '_id',
                                as: 'last_edited_by_data'
                            }
                        },
                    ], (er, docs) => {
                        common_functions.sendErrorOrResult(er, docs, res);
                    });
                }
            });
        };
        this.addProject = (req, res) => {
            if (req.file) {
                // @ts-ignore
                req.body.uploaded_document = req.file.location;
            }
            // is_published to boolean from string
            req.body.is_published == 'true' ? req.body.is_published = true : req.body.is_published = false;
            req.body.roadway_area_type = JSON.parse(req.body.roadway_area_type);
            req.body.roadway_classification = JSON.parse(req.body.roadway_classification);
            req.body.focus_area = JSON.parse(req.body.focus_area);
            req.body.average_annual_day_traffic_vehicular_volume = JSON.parse(req.body.average_annual_day_traffic_vehicular_volume);
            req.body.problems_to_be_addressed = JSON.parse(req.body.problems_to_be_addressed);
            req.body.crash_types_being_targeted = JSON.parse(req.body.crash_types_being_targeted);
            req.body.countermeasures = JSON.parse(req.body.countermeasures);
            project_model_1.default.create(req.body, (er, docs) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        };
        this.uploadProjectDocument = (req, res) => {
            if (req.file) {
                const project_id = req.params.id;
                // @ts-ignore
                const file_location = req.file.location;
                const update_object = { uploaded_document: file_location, last_edited_by: req.body.user_id };
                const user = req.body.user_id;
                project_model_1.default.findByIdAndUpdate(project_id, { $set: update_object }, (er, docs) => {
                    common_functions.sendErrorOrResult(er, docs, res);
                });
            }
        };
        this.updateProject = (req, res) => {
            if (req.file) {
                // @ts-ignore
                req.body.uploaded_document = req.file.location;
            }
            else {
                req.body.uploaded_document = undefined;
            }
            // is_published to boolean from string
            req.body.is_published == 'true' ? req.body.is_published = true : req.body.is_published = false;
            req.body.roadway_area_type = JSON.parse(req.body.roadway_area_type);
            req.body.roadway_classification = JSON.parse(req.body.roadway_classification);
            req.body.focus_area = JSON.parse(req.body.focus_area);
            req.body.average_annual_day_traffic_vehicular_volume = JSON.parse(req.body.average_annual_day_traffic_vehicular_volume);
            req.body.problems_to_be_addressed = JSON.parse(req.body.problems_to_be_addressed);
            req.body.crash_types_being_targeted = JSON.parse(req.body.crash_types_being_targeted);
            req.body.countermeasures = JSON.parse(req.body.countermeasures);
            project_model_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, (er, docs) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        };
        this.deleteProject = (req, res) => {
            project_model_1.default.findByIdAndDelete(req.params.id, {}, (er, docs) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        };
        // getProject
        this.getProject = (req, res) => {
            project_model_1.default.findById(req.params.id, (er, docs) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        };
        this.getAllFilterData = (req, res) => {
            const data = {
                aadtvv: [],
                problems_to_be_addressed: [],
                countermeasures: [],
                target_crash_type: [],
                focus_area: [],
                roadway_classification: [],
                roadway_area_type: []
            };
            aadtvv_model_1.default.find({}, (er, docs) => {
                data.aadtvv = docs;
                problems_to_be_addressed_model_1.default.find({}, (er, docs) => {
                    data.problems_to_be_addressed = docs;
                    countermeasure_model_1.default.find({}, (er, docs) => {
                        data.countermeasures = docs;
                        target_crash_type_model_1.default.find({}, (er, docs) => {
                            data.target_crash_type = docs;
                            focus_area_model_1.default.find({}, (er, docs) => {
                                data.focus_area = docs;
                                roadway_classification_model_1.default.find({}, (er, docs) => {
                                    data.roadway_classification = docs;
                                    roadway_area_type_model_1.default.find({}, (er, docs) => {
                                        data.roadway_area_type = docs;
                                        res.json(data);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        };
        // downloadProjectPdf (return blob)
        this.downloadProjectPdf = (req, res) => __awaiter(this, void 0, void 0, function* () {
            project_model_1.default.aggregate([
                {
                    $match: { _id: mongoose_1.default.Types.ObjectId(req.params.id) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'added_by',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $lookup: {
                        from: 'roadway_area_types',
                        localField: 'roadway_area_type',
                        foreignField: '_id',
                        as: 'roadway_area_type'
                    }
                },
                {
                    $lookup: {
                        from: 'roadway_classifications',
                        localField: 'roadway_classification',
                        foreignField: '_id',
                        as: 'roadway_classification'
                    }
                },
                {
                    $lookup: {
                        from: 'focus_areas',
                        localField: 'focus_area',
                        foreignField: '_id',
                        as: 'focus_area'
                    }
                },
                {
                    $lookup: {
                        from: 'aadtvvs',
                        localField: 'average_annual_day_traffic_vehicular_volume',
                        foreignField: '_id',
                        as: 'aadtvv'
                    }
                },
                {
                    $lookup: {
                        from: 'problems_to_be_addresseds',
                        localField: 'problems_to_be_addressed',
                        foreignField: '_id',
                        as: 'problems_to_be_addressed'
                    }
                },
                {
                    $lookup: {
                        from: 'target_crash_types',
                        localField: 'target_crash_type',
                        foreignField: '_id',
                        as: 'target_crash_type'
                    }
                }
            ], (er, docs) => __awaiter(this, void 0, void 0, function* () {
                if (er) {
                    res.status(500).json(er);
                }
                else {
                    const project = docs[0];
                    const project_pdf_template = new project_pdf_1.ProjectPDF();
                    const html = project_pdf_template.getProjectPDFTemplate(project);
                    // Launch Puppeteer and create a new page
                    const browser = yield puppeteer.launch({
                        headless: true,
                        args: ['--no-sandbox']
                    });
                    const page = yield browser.newPage();
                    // Set the HTML content of the page
                    yield page.setContent(html);
                    // Generate the PDF
                    const pdfBuffer = yield page.pdf({ format: 'A4' });
                    // Close the Puppeteer instance
                    const readableDateNow = new Date(project.createdAt).toLocaleDateString();
                    const filename = `${project.roadway_name}_${readableDateNow}.pdf`;
                    // Set the response headers for the PDF download
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                    // Send the PDF buffer as the response
                    res.send(pdfBuffer);
                    // Close the browser
                    yield browser.close();
                    // res.json(docs);
                }
            }));
        });
        // delete department
        this.deleteDepartment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // check if department is assigned to any user or project
            const department_id = req.params.id;
            const users = yield user_model_1.default.find({ assigned_departments: department_id });
            const projects = yield project_model_1.default.find({ department: department_id });
            if (users.length > 0 || projects.length > 0) {
                res.status(500).json('Department is assigned to ' + users.length + ' users and ' + projects.length + ' projects');
            }
            else {
                department_model_1.default.findByIdAndDelete(department_id, {}, (er, docs) => {
                    common_functions.sendErrorOrResult(er, docs, res);
                });
            }
        });
        this.getUserById = (req, res) => {
            const user_id = req.params.id;
            user_model_1.default.aggregate([
                {
                    $match: { _id: mongoose_1.default.Types.ObjectId(user_id) }
                },
                {
                    $lookup: {
                        from: 'pitches',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'pitches'
                    }
                }
            ], (er, docs) => {
                if (er) {
                    send_mail.sendErrorAlert(er);
                    res.status(500).json(er);
                }
                else {
                    common_functions.sendErrorOrResult(er, docs[0], res);
                }
            });
        };
        this.updateUser = (req, res) => {
            const user = req.body;
            // encrypt and add new password if password is present
            if (user.password) {
                encryption.encryptUserPassword(user.password, (hash) => {
                    user.password = hash;
                    user_model_1.default.findByIdAndUpdate(user._id, { $set: Object.assign({}, user) }, (er, status) => {
                        if (er) {
                            send_mail.sendErrorAlert(er);
                            res.status(500).json(er);
                        }
                        else {
                            res.json(status);
                        }
                    });
                });
            }
            else {
                // remove password from user object
                delete user.password;
                user_model_1.default.findByIdAndUpdate(user._id, { $set: Object.assign({}, user) }, (er, status) => {
                    if (er) {
                        send_mail.sendErrorAlert(er);
                        res.status(500).json(er);
                    }
                    else {
                        res.json(status);
                    }
                });
            }
        };
        this.changePassword = (req, res) => {
            const user_id = req.body.user_id;
            const old_password = req.body.old_password;
            const new_password = req.body.new_password;
            user_model_1.default.findById(user_id, (er, user) => {
                if (er) {
                    send_mail.sendErrorAlert(er);
                    res.status(500).json(er);
                }
                else {
                    encryption.comparePasswords(old_password, user.password, (matched) => {
                        if (matched) {
                            // encrypt and add new password
                            encryption.encryptUserPassword(new_password, (hash) => {
                                user_model_1.default.findByIdAndUpdate(user_id, { $set: { password: hash } }, (err, status) => {
                                    if (err) {
                                        send_mail.sendErrorAlert(err);
                                        res.status(500).json(err);
                                    }
                                    else {
                                        res.json(status);
                                    }
                                });
                            });
                        }
                        else {
                            // Throw error
                            res.status(500).json('Password is incorrect');
                        }
                    });
                }
            });
        };
        this.addDepartment = (req, res) => {
            const department = req.body;
            department_model_1.default.create(department, (er, docs) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        };
        this.updateDepartment = (req, res) => {
            const department = req.body;
            department_model_1.default.findByIdAndUpdate(req.params.id, { $set: Object.assign({}, department) }, (er, docs) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        };
        this.getDepartments = (req, res) => {
            department_model_1.default.find({}, (er, docs) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        };
        // assign user to department
        this.assignUserToDepartment = (req, res) => {
            const user_id = req.body.user_id;
            const department_id = req.body.department_id;
            user_model_1.default.findByIdAndUpdate(user_id, { $push: { assigned_departments: department_id } }, (er, docs) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        };
        this.deleteUploadedDocument = (req, res) => {
            project_model_1.default.findByIdAndUpdate(req.params.id, { $set: { uploaded_document: undefined } }, (er, docs) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        };
    }
}
exports.UserController = UserController;
