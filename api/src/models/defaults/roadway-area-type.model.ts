import mongoose from 'mongoose';
import { CONSTANTS } from '../../config/constants';



const roadway_area_typeSchema = new mongoose.Schema(
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



const roadway_area_type_model = mongoose.model('roadway_area_type', roadway_area_typeSchema);
export default roadway_area_type_model;