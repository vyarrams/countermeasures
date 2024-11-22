import * as aws from 'aws-sdk';
import * as path from 'path';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { nanoid } from 'nanoid';
import { CONSTANTS } from '../config/constants';
aws.config.loadFromPath('s3.json');
const s3 = new aws.S3();
import dotenv from 'dotenv';
import user_model from '../models/user/user.model';

dotenv.config({ path: path.resolve(__dirname, `../../config/${process.env.ENVIRONMENT}.env`) });

const bucket = 'countermeasures-svaapta';


export const mem_upload = multer({ storage: multer.memoryStorage() });




export const uploadProjectDocument = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucket,
        // @ts-ignore
        metadata: function (req: Request, file: any, cb: any) {
            cb(null, { fieldName: file.fieldname });
        },
        // @ts-ignore
        key: function (req: Request, file: any, cb: any) {
            const fileName = nanoid(10).toString() + path.extname(file.originalname);
            const new_path = 'projects/' + fileName;
            cb(null, new_path);
        }
    })
});


