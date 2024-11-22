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

const projectSchema = new mongoose.Schema(
    {
        roadway_name: {
            type: String,
            trim: true,
            required: 'Roadway name is required'
        },
        from: {
            type: String,
            trim: true,
            required: false
        },
        to: {
            type: String,
            trim: true,
            required: false
        },
        city: {
            type: String,
            trim: true,
            required: false
        },
        parish: {
            type: String,
            trim: true,
            required: false
        },
        control_section: {
            type: String,
            trim: true,
            required: false
        },
        begin_mile: {
            type: String,
            trim: true,
            required: false
        },
        end_mile: {
            type: String,
            trim: true,
            required: false
        },
        description: {
            type: String,
            trim: true,
            required: false
        },
        coords: {
            type: Object,
            trim: true,
            required: false
        },
        location: {
            type: String,
            trim: true,
            required: false
        },
        latitude: {
            type: String,
            trim: true,
            required: false
        },
        longitude: {
            type: String,
            trim: true,
            required: false
        },
        google_maps_location: {
            type: String,
            trim: true,
            required: false
        },
        roadway_area_type: {
            type: [mongoose.Schema.Types.ObjectId],
            trim: true,
            required: false
        },
        roadway_classification: {
            type: [mongoose.Schema.Types.ObjectId],
            trim: true,
            required: false
        },
        focus_area: {
            type: [mongoose.Schema.Types.ObjectId],
            trim: true,
            required: false
        },
        average_annual_day_traffic_vehicular_volume: {
            type: [mongoose.Schema.Types.ObjectId],
            trim: true,
            required: false
        },
        problems_to_be_addressed: {
            type: [mongoose.Schema.Types.ObjectId],
            trim: true,
            required: false
        },
        crash_types_being_targeted: {
            type: [mongoose.Schema.Types.ObjectId],
            trim: true,
            required: false
        },
        countermeasures: {
            type: [],
            trim: true,
            required: false
        },
        total_project_cost: {
            type: String,
            trim: true,
            required: false
        },
        total_savings_in_crash_reduction: {
            type: String,
            trim: true,
            required: false
        },
        benefit_cost_ratio: {
            type: String,
            trim: true,
            required: false
        },
        notes: {
            type: String,
            trim: true,
            required: false
        },
        added_by: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true,
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'department',
            required: true
        },
        uploaded_document: {
            type: String,
            required: false
        },
        is_published: {
            type: Boolean,
            default: false
        },
        last_edited_by: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true,
            ref: 'user',
        }

    },
    {
        timestamps: true
    }
);



const project_model = mongoose.model('project', projectSchema);
export default project_model;