import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: 'Department name is required'
        }
    },
    {
        timestamps: true
    }
);



const department_model = mongoose.model('department', departmentSchema);
export default department_model;