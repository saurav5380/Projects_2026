const {PrismaClient} = require('./generated/prisma/client');
const {PrismaPg} = require('@prisma/adapter-pg');

if (!process.env.DATABASE_URL){
    throw new Error ("Database URL is not set")
}

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({adapter})

module.exports = prisma;
