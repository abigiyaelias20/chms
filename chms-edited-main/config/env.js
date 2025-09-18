import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; // 1 day
export const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;