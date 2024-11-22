import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, `../../config/${process.env.ENVIRONMENT}.env`)});

export default Object.freeze({
    db: process.env.DATABASE as string,
});