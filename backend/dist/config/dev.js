import dotenv from 'dotenv';
dotenv.config();
export default {
    dbURL: process.env.DB_URL || '',
    dbName: process.env.DB_NAME || '',
};
