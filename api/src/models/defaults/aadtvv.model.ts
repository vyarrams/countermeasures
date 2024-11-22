import mongoose from 'mongoose';
import { CONSTANTS } from '../../config/constants';



const aadtvvSchema = new mongoose.Schema(
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



const aadtvv_model = mongoose.model('aadtvv', aadtvvSchema);
export default aadtvv_model;