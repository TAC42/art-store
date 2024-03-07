import dotenv from 'dotenv';
import configProd from './prod.js';
import configDev from './dev.js';
dotenv.config();
let config;
if (process.env.NODE_ENV === 'production')
    config = configProd;
else
    config = configDev;
config.isGuestMode = true;
export { config };
