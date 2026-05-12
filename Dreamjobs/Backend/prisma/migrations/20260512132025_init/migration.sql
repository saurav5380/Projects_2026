-- CreateEnum
CREATE TYPE "Role" AS ENUM ('company', 'candidate', 'admin');

-- CreateEnum
CREATE TYPE "Job_type" AS ENUM ('full_time', 'part_time', 'remote');

-- CreateEnum
CREATE TYPE "Job_status" AS ENUM ('pending', 'active', 'closed', 'rejected');

-- CreateEnum
CREATE TYPE "Application_status" AS ENUM ('applied', 'reviewed', 'shortlisted', 'rejected', 'accepted');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Companies" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "company_name" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidates" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "headline" TEXT NOT NULL,
    "resume_url" TEXT NOT NULL,

    CONSTRAINT "Candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job_Listings" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "job_type" "Job_type" NOT NULL,
    "job_status" "Job_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_Listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applications" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "candidate_id" INTEGER NOT NULL,
    "cover_note" TEXT,
    "resume_url" TEXT NOT NULL,
    "status" "Application_status" NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Job_Listings_slug_key" ON "Job_Listings"("slug");

-- AddForeignKey
ALTER TABLE "Companies" ADD CONSTRAINT "Companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidates" ADD CONSTRAINT "Candidates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Listings" ADD CONSTRAINT "Job_Listings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job_Listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
