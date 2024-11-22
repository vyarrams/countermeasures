import dotenv from 'dotenv';
import path from 'path';
import app from './app';
import * as http from 'http';
import * as https from 'https';

dotenv.config({ path: path.resolve(__dirname, `../config/${process.env.ENVIRONMENT}.env`) });

var fs = require('fs');
const options = {
    key: fs.readFileSync("./cert/private.key"),
    cert: fs.readFileSync("./cert/certificate.crt")
};
let port1 = 80;
let port2 = 443;
let server1 = http.createServer(app).listen(port1, () => {
    console.log(`listening on ${port1}`); console.log(process.env.DATABASE);

});
let server2 = https.createServer(options, app).listen(port2, () => { console.log(`listening on ${port2}`); });