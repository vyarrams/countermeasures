import mongoose from 'mongoose';
import { CONSTANTS } from '../../config/constants';



const countermeasureSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: 'Name is required',
            unique: true
        },
        pros: {
            type: [],
            trim: true,
            required: 'Pros are required'
        },
        cons: {
            type: [],
            trim: true,
            required: 'Cons are required'
        },
        category: {
            type: String,
            trim: true,
            required: false
        },
        ref_value: {
            type: Number,
            trim: true,
            required: true
        }
    },
    {
        timestamps: true
    }
);



const countermeasure_model = mongoose.model('countermeasure', countermeasureSchema);
export default countermeasure_model;