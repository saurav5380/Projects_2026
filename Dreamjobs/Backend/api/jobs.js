const validSession = require("../middleware/sessionMgmt");
const requireRole = require("../middleware/requireRole"); 
const express = require('express');
const slugify = require('slugify');
const prisma = require("../db");
const { PrismaClientKnownRequestError, PrismaClientValidationError } = require("../generated/prisma");

const jobsRouter = express.Router();

jobsRouter.post("/jobs", validSession, requireRole('company'), async (req, res) => {
            try{
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
                    job_status: ["pending", "active", "closed", "rejected"].includes(req.body.job_status) ? req.body.job_status : "pending"
                }
                const company = await prisma.companies.findUnique({where: {user_id: req.user.sub}});
                const response = await prisma.job_Listings.create({
                    data: jobData,
                    company_id: company.id
                })
                res.status(201).json({
                    message: "New job posting created"
                })
            }
            catch(error){
                if (error instanceof PrismaClientKnownRequestError){
                    return res.status(400).json({
                        error: "Database error",
                        message: error.message,
                        code: error.code,
                        details: error.meta
                    })
                }
                else if (error instanceof PrismaClientValidationError){
                    res.status(422).json({
                        error: "Validation error",
                        message: error.message,
                        code: error.code,
                        details: error.meta
                    })
                }

                else{
                    res.status(500).json({
                        error: "Internal Server Error",
                        message: error.message,
                        code: error.code,
                        details: error.meta
                    })
                }

            }
            })


jobsRouter.get("/jobs", validSession, requireRole('candidate'), async(req,res) => {
    try{
        
        const queryData = {
            ...(req.query.category && {'category': req.query.category}),
            ...(req.query.location && {'location': req.query.location}),
            ...(req.query.job_type && {'job_type': req.query.job_type}),
            ...(req.query.page && {'page': req.query.page})
        }
        const response = await prisma.job_Listings.findMany({where: queryData});
        res.status(200).json(response)
    }
    catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            res.status(400).json({
                error: "Database Error",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }
        else if (error instanceof PrismaClientValidationError){
            res.status(400).json({
                error: "Validation Error",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }

        else{
            res.status(500).json({
                error: "Internal Server Error",
                message: error.message,
                code: error.code,
                meta: error.meta
            })
        }

    }
})














module.exports = jobsRouter;