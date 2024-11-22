import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { json, Request, Response } from 'express';
// import { Validators } from './common/validators';
import { CONSTANTS } from '../config/constants';
import { Encryption } from '../functions/encryption';
import { StopWords } from '../functions/stopwords';
import { SendMail } from '../functions/send_mail';
import { CommonFunctions } from '../functions/common';
const puppeteer = require('puppeteer');


// Models
import user_model from '../models/user/user.model';

const encryption = new Encryption();
const stop_words = new StopWords();
const send_mail = new SendMail();
const common_functions = new CommonFunctions();
import fs from 'fs';
import project_model from '../models/user/project.model';
import roadway_area_type_model from '../models/defaults/roadway-area-type.model';
import roadway_classification_model from '../models/defaults/roadway-classification.model';
import focus_area_model from '../models/defaults/focus-area.model';
import aadtvv_model from '../models/defaults/aadtvv.model';
import problems_to_be_addressed_model from '../models/defaults/problems-to-be-addressed.model';
import countermeasure_model from '../models/defaults/countermeasure.model';
import target_crash_type_model from '../models/defaults/target-crash-type.model';
import { ProjectPDF } from '../email_templates/project-pdf';
import department_model from '../models/user/department.model';
import XLSX from 'xlsx';

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

dotenv.config({ path: path.resolve(__dirname, `../../config/${process.env.ENVIRONMENT}.env`) });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export class UserController {

    constructor() {
    }

    public tempUpdateData = (req: Request, res: Response) => {
        // console.log(req.body.file);
        console.log('Hello');
        res.json('Hello');
        console.log(req.body);
        console.log(req.file);
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetNames = workbook.SheetNames;
        const firstSheetName = sheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        data.forEach((row: any) => {
            const id = row.id;
            const pros_content = row.PROS;
            const pros_array = pros_content.split('\n');
            const cons_content = row.CONS;
            const cons_array = cons_content.split('\n');
            const update_object = { pros: pros_array, cons: cons_array };
            console.log('Updating', id, update_object);

            countermeasure_model.findByIdAndUpdate(id, { $set: update_object }, (er: any, docs: any) => {
                console.log(er, docs);
            });
        });


    }

    // **** USER **** //
    public register = (req: Request, res: Response) => {
        try {
            encryption.encryptUserPassword(req.body.password, (hash: string) => {
                req.body.password = hash;
                req.body.email = req.body.email.toLowerCase();
                user_model.create(req.body, (err: any, status: any) => {
                    if (err) {
                        res.status(CONSTANTS.http_codes.INTERNAL_ERROR).json(err);
                    } else {
                        encryption.userGenerateJSONtokenForRegistration(status, res);
                    }
                });
            })
        } catch (error) {
            res.status(CONSTANTS.http_codes.INTERNAL_ERROR).json(error);
        }
    }


    public login = (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        user_model.findOne({ email: email }, (er: any, record: any) => {
            if (record) {
                encryption.comparePasswords(password, record.password, (matched: boolean) => {
                    if (matched) {
                        encryption.userGenerateJSONtoken(record, res);
                    } else {
                        res.status(CONSTANTS.http_codes.BAD_REQUEST).json('Wrong Password');
                    }
                });
            } else {
                res.status(CONSTANTS.http_codes.NOT_FOUND).json('No user found');
            }
        })
    }

    public sendEmailVerificationLink = (req: Request, res: Response) => {
        const user_id = req.params.id;
        user_model.findById(user_id, (er: any, docs: any) => {
            if (er) {
                send_mail.sendErrorAlert(er);
                res.status(500).json(er);
            } else {
                const user = docs;
                encryption.userGenerateJSONtokenForResendVerification(user, res);
            }
        });
    }

    public getAllUsers = (req: Request, res: Response) => {
        user_model.aggregate([
            {
                $lookup: {
                    from: 'departments',
                    localField: 'assigned_departments',
                    foreignField: '_id',
                    as: 'departments'
                }
            }
        ], (er: any, docs: any) => {
            common_functions.sendErrorOrResult(er, docs, res);
        });
    }

    public getAllProjects = (req: Request, res: Response) => {
        project_model.aggregate([
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
        ], (er: any, docs: any) => {
            common_functions.sendErrorOrResult(er, docs, res);
        });
    }

    // getAgentProjects
    public getAgentProjects = (req: Request, res: Response) => {

        // get departments of user
        user_model.findById(req.params.id, (er: any, user: any) => {
            if (er) {
                send_mail.sendErrorAlert(er);
                res.status(500).json(er);
            } else {
                const departments = user.assigned_departments;
                project_model.aggregate([
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
                ], (er: any, docs: any) => {
                    common_functions.sendErrorOrResult(er, docs, res);
                });
            }
        });
    }

    // getViewOnlyProjects
    public getViewOnlyProjects = (req: Request, res: Response) => {

        // get departments of user
        user_model.findById(req.params.id, (er: any, user: any) => {
            if (er) {
                send_mail.sendErrorAlert(er);
                res.status(500).json(er);
            } else {
                const departments = user.assigned_departments;
                project_model.aggregate([
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
                ], (er: any, docs: any) => {
                    common_functions.sendErrorOrResult(er, docs, res);
                });
            }
        });
    }


    public addProject = (req: Request, res: Response) => {
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
        project_model.create(req.body, (er: any, docs: any) => {
            common_functions.sendErrorOrResult(er, docs, res);
        });
    }

    public uploadProjectDocument = (req: Request, res: Response) => {
        if (req.file) {
            const project_id = req.params.id;
            // @ts-ignore
            const file_location = req.file.location;
            const update_object = { uploaded_document: file_location, last_edited_by: req.body.user_id };
            const user = req.body.user_id;
            project_model.findByIdAndUpdate(project_id, { $set: update_object }, (er: any, docs: any) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        }
    }

    public updateProject = (req: Request, res: Response) => {
        if (req.file) {
            // @ts-ignore
            req.body.uploaded_document = req.file.location;
        } else {
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
        project_model.findByIdAndUpdate(req.params.id, { $set: req.body }, (er: any, docs: any) => {
            common_functions.sendErrorOrResult(er, docs, res);
        });
    }

    public deleteProject = (req: Request, res: Response) => {
        project_model.findByIdAndDelete(req.params.id, {}, (er: any, docs: any) => {
            common_functions.sendErrorOrResult(er, docs, res);
        });
    }

    // getProject
    public getProject = (req: Request, res: Response) => {
        project_model.findById(req.params.id, (er: any, docs: any) => {
            common_functions.sendErrorOrResult(er, docs, res);
        });
    }


    public getAllFilterData = (req: Request, res: Response) => {

        const data = {
            aadtvv: [],
            problems_to_be_addressed: [],
            countermeasures: [],
            target_crash_type: [],
            focus_area: [],
            roadway_classification: [],
            roadway_area_type: []
        };
        aadtvv_model.find({}, (er: any, docs: any) => {
            data.aadtvv = docs;
            problems_to_be_addressed_model.find({}, (er: any, docs: any) => {
                data.problems_to_be_addressed = docs;
                countermeasure_model.find({}, (er: any, docs: any) => {
                    data.countermeasures = docs;
                    target_crash_type_model.find({}, (er: any, docs: any) => {
                        data.target_crash_type = docs;
                        focus_area_model.find({}, (er: any, docs: any) => {
                            data.focus_area = docs;
                            roadway_classification_model.find({}, (er: any, docs: any) => {
                                data.roadway_classification = docs;
                                roadway_area_type_model.find({}, (er: any, docs: any) => {
                                    data.roadway_area_type = docs;
                                    res.json(data);
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    // downloadProjectPdf (return blob)
    public downloadProjectPdf = async (req: Request, res: Response) => {
        project_model.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(req.params.id) }
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
        ], async (er: any, docs: any) => {
            if (er) {
                res.status(500).json(er);
            } else {
                const project = docs[0];
                const project_pdf_template = new ProjectPDF();
                const html = project_pdf_template.getProjectPDFTemplate(project);
                // Launch Puppeteer and create a new page
                const browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox']
                });
                const page = await browser.newPage();
                // Set the HTML content of the page
                await page.setContent(html);

                // Generate the PDF
                const pdfBuffer = await page.pdf({ format: 'A4' });
                // Close the Puppeteer instance
                const readableDateNow = new Date(project.createdAt).toLocaleDateString();
                const filename = `${project.roadway_name}_${readableDateNow}.pdf`;

                // Set the response headers for the PDF download
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

                // Send the PDF buffer as the response
                res.send(pdfBuffer);




                // Close the browser
                await browser.close();

                // res.json(docs);


            }
        });
    }


    // delete department
    public deleteDepartment = async (req: Request, res: Response) => {
        // check if department is assigned to any user or project
        const department_id = req.params.id;
        const users = await user_model.find({ assigned_departments: department_id });
        const projects = await project_model.find({ department: department_id });
        if (users.length > 0 || projects.length > 0) {
            res.status(500).json('Department is assigned to ' + users.length + ' users and ' + projects.length + ' projects');
        } else {
            department_model.findByIdAndDelete(department_id, {}, (er: any, docs: any) => {
                common_functions.sendErrorOrResult(er, docs, res);
            });
        }
    }





    public getUserById = (req: Request, res: Response) => {
        const user_id = req.params.id;
        user_model.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(user_id) }
            },
            {
                $lookup: {
                    from: 'pitches',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'pitches'
                }
            }
        ], (er: any, docs: any) => {
            if (er) {
                send_mail.sendErrorAlert(er);
                res.status(500).json(er);
            } else {
                common_functions.sendErrorOrResult(er, docs[0], res);
            }
        });
    }



    public updateUser = (req: Request, res: Response) => {

        const user = req.body;
        // encrypt and add new password if password is present
        if (user.password) {
            encryption.encryptUserPassword(user.password, (hash: string) => {
                user.password = hash;
                user_model.findByIdAndUpdate(user._id, { $set: { ...user } }, (er: any, status: any) => {
                    if (er) {
                        send_mail.sendErrorAlert(er);
                        res.status(500).json(er);
                    } else {
                        res.json(status);
                    }
                });
            });
        } else {
            // remove password from user object
            delete user.password;
            user_model.findByIdAndUpdate(user._id, { $set: { ...user } }, (er: any, status: any) => {
                if (er) {
                    send_mail.sendErrorAlert(er);
                    res.status(500).json(er);
                } else {
                    res.json(status);
                }
            });
        }
    }

    public changePassword = (req: Request, res: Response) => {
        const user_id = req.body.user_id;
        const old_password = req.body.old_password;
        const new_password = req.body.new_password;
        user_model.findById(user_id, (er: any, user: any) => {
            if (er) {
                send_mail.sendErrorAlert(er);
                res.status(500).json(er);
            } else {
                encryption.comparePasswords(old_password, user.password, (matched: boolean) => {
                    if (matched) {
                        // encrypt and add new password
                        encryption.encryptUserPassword(new_password, (hash: string) => {
                            user_model.findByIdAndUpdate(user_id, { $set: { password: hash } }, (err: any, status: any) => {
                                if (err) {
                                    send_mail.sendErrorAlert(err);
                                    res.status(500).json(err);
                                } else {
                                    res.json(status);
                                }
                            });
                        });
                    } else {
                        // Throw error
                        res.status(500).json('Password is incorrect');
                    }
                });
            }
        });
    }


    public addDepartment = (req: Request, res: Response) => {
        const department = req.body;
        department_model.create(department, (er: any, docs: any) => {
            common_functions.sendErrorOrResult(er, docs, res);
        });
    }

    public updateDepartment = (req: Request, res: Response) => {
        const department = req.body;
        department_model.findByIdAndUpdate(req.params.id, { $set: { ...department } }, (er: any, docs: any) => {
            common_functions.sendErrorOrResult(er, docs, res);
        });
    }

    public getDepartments = (req: Request, res: Response) => {
        department_model.find({}, (er: any, docs: any) => {
            common_functions.sendErrorOrResult(er, docs, res);
        });
    }

    // assign user to department
    public assignUserToDepartment = (req: Request, res: Response) => {
        const user_id = req.body.user_id;
        const department_id = req.body.department_id;
        user_model.findByIdAndUpdate(user_id, { $push: { assigned_departments: department_id } }, (er: any, docs: any) => {
            common_functions.sendErrorOrResult(er, docs, res);
        });
    }

    public deleteUploadedDocument = (req: Request, res: Response) => {
        project_model.findByIdAndUpdate(req.params.id, { $set: { uploaded_document: undefined } }, (er: any, docs: any) => {
            common_functions.sendErrorOrResult(er, docs, res);
        });
    }



}