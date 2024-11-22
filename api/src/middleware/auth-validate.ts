import { CONSTANTS } from "../config/constants";
import jwt from 'jsonwebtoken';


export class AuthValidate {
    validate = (req: any, res: any, next: any) => {
        const bearerHeader = req.headers['authorization'];
        // Check if Bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;
            // Next
            if (bearerToken) {
                jwt.verify(req.token, CONSTANTS.jwt_user_secret, (err: any, authData: any) => {
                    if (err) {
                        res.status(401).json(err);
                    } else {
                        next();
                    }
                });
            } else {
                res.status(401).json('Invalid token');
            }
        } else {
            res.status(401).json('Empty token')
        }
    }
    admin_validate = (req: any, res: any, next: any) => {
        const bearerHeader = req.headers['authorization'];
        // Check if Bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;
            // Next
            if (bearerToken) {
                jwt.verify(req.token, CONSTANTS.jwt_user_secret, (err: any, authData: any) => {
                    if (err) {
                        res.status(401).json(err);
                    } else {
                        // if authData.is_admin is true then only allow
                        if (authData?.user?.is_admin) {
                            next();
                        } else {
                            res.status(401).json('Unauthorized');
                        }
                    }
                });
            } else {
                res.status(401).json('Invalid token');
            }
        } else {
            res.status(401).json('Empty token')
        }
    }
}