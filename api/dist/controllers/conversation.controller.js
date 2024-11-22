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
exports.ConversationController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const send_mail_1 = require("../functions/send_mail");
const common_1 = require("../functions/common");
const conversation_model_1 = __importDefault(require("../models/user/conversation.model"));
const message_model_1 = __importDefault(require("../models/user/message.model"));
const send_mail = new send_mail_1.SendMail();
const common_functions = new common_1.CommonFunctions();
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, `../../config/${process.env.ENVIRONMENT}.env`) });
class ConversationController {
    constructor() {
        this.getConversationOfUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            conversation_model_1.default.findOne({ users: { $all: [req.body.user_id, req.body.receiver_id] } }, (err, result) => {
                if (err) {
                    send_mail.sendErrorAlert(err);
                    res.status(500).json({ message: err });
                }
                else {
                    if (result) {
                        res.status(200).json({ success: true, message: 'Conversation found', data: result });
                    }
                    else {
                        res.status(200).json({ success: false, message: 'Conversation not found', data: result });
                    }
                }
            });
        });
        this.getConversationById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            message_model_1.default.aggregate([
                {
                    $match: {
                        conversation_id: mongoose_1.default.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { sender: '$sender' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$sender']
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    username: 1,
                                    email: 1,
                                    first_name: 1,
                                    last_name: 1,
                                    image: 1,
                                    createdAt: 1,
                                    updatedAt: 1
                                }
                            }
                        ],
                        as: 'sender'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { receiver: '$receiver' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$_id', '$$receiver']
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    username: 1,
                                    email: 1,
                                    first_name: 1,
                                    last_name: 1,
                                    image: 1,
                                    createdAt: 1,
                                    updatedAt: 1
                                }
                            }
                        ],
                        as: 'receiver'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        conversation_id: 1,
                        sender: 1,
                        receiver: 1,
                        message: 1,
                        is_read: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                {
                    $sort: {
                        createdAt: 1
                    }
                }
            ], (err, result) => {
                common_functions.sendErrorOrResult(err, result, res);
            });
        });
        this.createConversation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            conversation_model_1.default.findOne({ users: { $all: [req.body.user_id, req.body.receiver_id] } }, (err, result) => {
                if (err) {
                    send_mail.sendErrorAlert(err);
                    res.status(500).json({ message: err });
                }
                else {
                    if (result) {
                        res.status(200).json({ message: 'Conversation already exists', data: result });
                    }
                    else {
                        conversation_model_1.default.create(req.body, (err, result) => {
                            if (err) {
                                send_mail.sendErrorAlert(err);
                                res.status(400).json({ message: err });
                            }
                            else {
                                // check if message object exists in request body
                                if (req.body.message) {
                                    // create message object
                                    const message = {
                                        conversation_id: result._id,
                                        sender: req.body.message.sender,
                                        receiver: req.body.message.receiver,
                                        message: req.body.message.message
                                    };
                                    // create message
                                    message_model_1.default.create(message, (err, message_result) => {
                                        if (err) {
                                            res.status(400).json({ message: err });
                                        }
                                        else {
                                            res.status(200).json({ message: 'Conversation created successfully', data: result });
                                        }
                                    });
                                }
                                res.status(200).json({ message: 'Conversation created successfully', data: result });
                            }
                        });
                    }
                }
            });
        });
        this.getAllUserConversations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Assuming you have the user ID available
            const userId = req.params.user_id;
            // Define the aggregation pipeline
            const pipeline = [
                // Match conversations where the user is a participant
                {
                    $match: {
                        users: mongoose_1.default.Types.ObjectId(userId)
                    }
                },
                // Lookup to fetch user details
                {
                    $lookup: {
                        from: 'users',
                        let: { users: '$users' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $in: ['$_id', '$$users'] },
                                            { $ne: ['$_id', mongoose_1.default.Types.ObjectId(userId)] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    username: 1,
                                    email: 1,
                                    first_name: 1,
                                    last_name: 1,
                                    image: 1,
                                    createdAt: 1,
                                    updatedAt: 1
                                }
                            }
                        ],
                        as: 'user_details'
                    }
                },
                // Unwind the user_details array
                {
                    $unwind: '$user_details'
                },
                // Sort conversations by the latest message
                {
                    $lookup: {
                        from: 'messages',
                        let: { conversation_id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$conversation_id', '$$conversation_id'] }
                                }
                            },
                            {
                                $sort: { createdAt: -1 }
                            },
                            {
                                $limit: 1
                            },
                            {
                                $project: {
                                    sender: 1,
                                    receiver: 1,
                                    message: 1,
                                    is_read: 1,
                                    createdAt: 1,
                                }
                            }
                        ],
                        as: 'last_message'
                    }
                },
                // Unwind the last_message array
                {
                    $unwind: {
                        path: '$last_message',
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Sort conversations by the latest message's timestamp
                {
                    $sort: { 'last_message.createdAt': -1 }
                },
                // Group conversations to reconstruct the document structure
                {
                    $group: {
                        _id: '$_id',
                        user_details: { $first: '$user_details' },
                        last_message: { $first: '$last_message' }
                    }
                }
            ];
            // Execute the aggregation pipeline
            conversation_model_1.default.aggregate(pipeline)
                .exec((err, conversations) => {
                common_functions.sendErrorOrResult(err, conversations, res);
            });
        });
        this.sendMessage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            message_model_1.default.create(req.body, (err, result) => {
                common_functions.sendErrorOrResult(err, result, res);
            });
        });
    }
}
exports.ConversationController = ConversationController;
