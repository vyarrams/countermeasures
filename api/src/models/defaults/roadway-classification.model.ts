import mongoose from 'mongoose';
import { CONSTANTS } from '../../config/constants';



const roadway_classificationSchema = new mongoose.Schema(
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



const roadway_classification_model = mongoose.model('roadway_classification', roadway_classificationSchema);
export default roadway_classification_model;