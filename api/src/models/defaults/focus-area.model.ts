import mongoose from 'mongoose';
import { CONSTANTS } from '../../config/constants';



const focus_areaSchema = new mongoose.Schema(
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



const focus_area_model = mongoose.model('focus_area', focus_areaSchema);
export default focus_area_model;