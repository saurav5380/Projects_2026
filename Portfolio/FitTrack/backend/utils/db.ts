import {PrismaClient, Prisma} from "../generated/prisma/client.js";
import {PrismaPg} from "@prisma/adapter-pg";

const DATABASE_URL = process.env.DATABASE_URL;
console.log(DATABASE_URL);

if (!DATABASE_URL){
     throw new Error ("Database URL not set")
}

const prisma = new PrismaClient({adapter: new PrismaPg({ connectionString:DATABASE_URL })});

export default prisma;



