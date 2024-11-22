import mongoose from 'mongoose';
import { CONSTANTS } from '../../config/constants';



const target_crash_typeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: 'Name is required',
            unique: true
        },
        countermeasures: {
            type: [Number],
            trim: true,
            required: false
        },
    },
    {
        timestamps: true
    }
);



const target_crash_type_model = mongoose.model('target_crash_type', target_crash_typeSchema);
export default target_crash_type_model;