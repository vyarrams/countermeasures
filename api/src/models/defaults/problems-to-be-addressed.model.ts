import mongoose from 'mongoose';
import { CONSTANTS } from '../../config/constants';



const problems_to_be_addressedSchema = new mongoose.Schema(
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



const problems_to_be_addressed_model = mongoose.model('problems_to_be_addressed', problems_to_be_addressedSchema);
export default problems_to_be_addressed_model;