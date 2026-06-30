import {PrismaClient} from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL){
    throw new Error ('Database URL is not set')
}

const adapter = new PrismaPg({connectionString: DATABASE_URL})

const prisma = new PrismaClient({adapter});

export default prisma;

