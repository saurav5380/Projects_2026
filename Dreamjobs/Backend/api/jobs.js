const validSession = require("../middleware/sessionMgmt");
const requireRole = require("../middleware/requireRole");
const express = require('express');
const slugify = require('slugify');
const prisma = require("../db");
const { Prisma } = require("@prisma/client");

const jobsRouter = express.Router();

//=============================================== create new jobs =======================================================================//

jobsRouter.post("/jobs", validSession, requireRole('company'), async (req, res) => {
    try {
        const jobData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            slug: slugify(req.body.title, {
                lower: true,
                trim: true,
                remove: /[^a-zA-Z0-9\s]/g
            }),
            location: req.body.location,
            job_type: req.body.job_type,
            job_status: ["pending", "rejected"].includes(req.body.job_status) ? req.body.job_status : "pending"
        }
        const company = await prisma.companies.findUnique({ where: { user_id: req.user.sub } });
        if (!company) { return res.status(404).json({ message: "Company Profile not found" }) };
        const response = await prisma.job_Listings.create({
            data: { ...jobData, company_id: company.id }
        })
        res.status(201).json({
            message: "New job posting created"
        })
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(400).json({
                error: "Database error",
                message: error.message,
                code: error.code,
                details: error.meta
            })
        }
        else if (error instanceof Prisma.PrismaClientValidationError) {
            res.status(422).json({
                error: "Validation error",
                message: error.message,
                code: error.code,
                details: error.meta
            })
        }

        else {
            res.status(500).json({
                error: "Internal Server Error",
                message: error.message,
                code: error.code,
                details: error.meta
            })
        }

    }
})



//=============================================== get jobs based on filter criteria =======================================================================//

jobsRouter.get("/jobs", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const response = await prisma.job_Listings.findMany({
            where: {
                job_status: "active",
                ...(req.query.category && { 'category': req.query.category }),
                ...(req.query.location && { 'location': req.query.location }),
                ...(req.query.job_type && { 'job_type': req.query.job_type }),
            },
            skip: (page - 1) * limit,
            take: limit
        });
        res.status(200).json(response)

        const totalRecords = await prisma.job_Listings.count({
            where: {
                job_status: "active",
                ...(req.query.category && { 'category': req.query.category }),
                ...(req.query.location && { 'location': req.query.location }),
                ...(req.query.job_type && { 'job_type': req.query.job_type }),
            } })
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json({
                error: "Database Error",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }
        else if (error instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({
                error: "Validation Error",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }

        else {
            res.status(500).json({
                error: "Internal Server Error",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }

    }
})

//=============================================== get jobs based on slug =======================================================================//

jobsRouter.get("/jobs/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;
        const response = await prisma.job_Listings.findUnique({ where: { slug: slug } });
        if (!response) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json(response);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json({
                error: "Error finding job",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }
        else if (error instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({
                error: 'Validation Error',
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }

        else {
            res.status(500).json({
                error: "Inernal server error",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }
    }
})

//=============================================== update jobs based on job id =======================================================================//

jobsRouter.put("/jobs/:id", validSession, requireRole('company'), async (req, res) => {
    try {
        const jobId = parseInt(req.params.id);

        const company = await prisma.job_Listings.findFirst({ where: { user_id: req.user.sub } });

        if (!company) { return res.status(404).json("Company profile not found") };

        const response = await prisma.job_Listings.findUnique({ where: { id: jobId } });

        if (!response) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (response.company_id !== company.id) return res.status(403).json("Forbidden");

        const jobData = {
            ...(req.body.title && { title: req.body.title }),
            ...(req.body.description && { description: req.body.description }),
            ...(req.body.category && { category: req.body.category }),
            ...(req.body.location && { location: req.body.location }),
            ...(req.body.job_type && { job_type: req.body.job_type }),
        }



        const updateJob = await prisma.job_Listings.update({ where: { id: jobId }, data: jobData });
        res.status(201).json({
            message: "Job updated",
            data: updateJob
        })
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json({
                error: "Job could not be found",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }
        else if (error instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({
                error: "Validation Error",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }
        else {
            res.status(500).json({
                error: "Internal server error",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }
    }
})


//=============================================== delete jobs based on job id =======================================================================//

jobsRouter.delete("/jobs/:id", validSession, requireRole('company'), async (req, res) => {
    try {
        const jobId = parseInt(req.params.id);

        const company = await prisma.job_Listings.findFirst({ where: { user_id: req.user.sub } });

        if (!company) { return res.status(404).json("Company profile not found") };

        const response = await prisma.job_Listings.findUnique({ where: { id: jobId } });

        if (!response) { return res.status(404).json({ message: "Job Id not found" }) };

        if (response.company_id !== company.id) return res.status(403).json("Forbidden");

        const deleteJob = await prisma.job_Listings.delete({ where: { id: jobId } });

        res.json({ message: "Job Deleted successfully", deleteJob });

    }

    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json({
                error: "Could not delete job",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }
        else if (error instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({
                error: "Client Validation Error",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }
        else {
            res.status(500).json({
                error: "Unknown server error",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }
    }
})





module.exports = jobsRouter;
