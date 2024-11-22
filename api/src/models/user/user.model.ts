import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { CONSTANTS } from '../../config/constants';

var validateEmail = function (email: string): boolean {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var validateMobile = function (mobile: string): boolean {
    return /^\d{10}$/.test(mobile);
};

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            trim: true,
            required: 'First name is required'
        },
        last_name: {
            type: String,
            trim: true,
            required: false
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            required: 'Email address is required',
            validate: [validateEmail, 'Please provide a valid email address']
        },
        password: {
            type: String,
            trim: true,
            required: false,
            minlength: [4, 'Enter password with minimum 4 characters']
        },
        image: {
            type: Object,
            default: { location: CONSTANTS.default_user_image }
        },
        email_verified: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        is_admin: {
            type: Boolean,
            default: false
        },
        view_only: {
            type: Boolean,
            default: false
        },
        assigned_departments: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'department',
            default: []
        }


    },
    {
        timestamps: true
    }
);



const user_model = mongoose.model('user', userSchema);
export default user_model;