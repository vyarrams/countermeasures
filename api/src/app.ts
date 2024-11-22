import * as bp from 'body-parser';
import mongoose from 'mongoose';
import * as path from 'path';
import cors from 'cors';
import express, { Request, Response } from 'express';
import db from './config/database';
import userRoute from './routes/user.route';

import user_model from './models/user/user.model';
import { Encryption } from './functions/encryption';
import { log } from 'console';
const encryption = new Encryption();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
import jwt from 'jsonwebtoken';
import { CONSTANTS } from './config/constants';
import { SendMail } from './functions/send_mail';

const send_mail = new SendMail();

class Main {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.config();
        this.mongoConfig();
        this.routerConfig();
        // this.logs();
        this.loadStaticFilesConfig();
        // Configure Passport.js with Google Strategy
    }


    private config(): void {
        this.app.use(bp.json());
        this.app.use(cors());
        // Configure session middleware
        this.app.use(
            session({
                secret: 'sid1234kancharla',
                resave: true,
                saveUninitialized: true,
            })
        );
        this.app.use(bp.urlencoded({ extended: false }));
        // this.app.use(limiter)
        this.app.use((req: Request, res: Response, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
            res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type,Authorization');
            next();
        });
        // Passport serialization
        passport.serializeUser((user: any, done: any) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id: any, done: any) => {
            try {
                const user = await user_model.findById(id);
                done(null, user);
            } catch (error) {
                done(error, false);
            }
        });
    }



    private mongoConfig(): void {
        const options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            // autoIndex: false, // Don't build indexes
            // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            // reconnectInterval: 5000, // Reconnect every 500ms
            poolSize: 100, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            // bufferMaxEntries: 0,
            connectTimeoutMS: 100000, // Give up initial connection after 10 seconds
            socketTimeoutMS: 900000, // Close sockets after 45 seconds of inactivity
            // replicaSet: 'rsMongoProd'
        };
        mongoose.connect(db.db, options);
        mongoose.Promise = global.Promise;
        mongoose.set('useFindAndModify', false);
        mongoose.connection.on('connected', () => {
            console.log('Connected to database');
            // logger.log('info', 'connected to database')
        });
        mongoose.connection.on('error', (err: any) => {
            console.log('mongoErr', err);
            // logger.error('mongoErr', err);
        })
    }
    private routerConfig(): void {
        this.app.use('/user', userRoute);
    }
    private loadStaticFilesConfig(): void {
        this.app.use(express.static(path.join(__dirname, 'public')));
    }
}
export default new Main().app;