import 'dotenv/config';
import {PrismaClient} from '../src/generated/prisma/client.js';
import {PrismaPg} from '@prisma/adapter-pg';

if (!process.env.DATABASE_URL){
    throw new Error("Database URL is not available")
}

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({adapter});

export default prisma;
