import z from 'zod';
import 'dotenv';

const envSchema = z.object({
    DATABASE_URL: z.url().refine((val)=> val.startsWith("http://"),{message:"Database URL should be a http address"}),
    FRONTEND_PORT: z.coerce.number().int().positive().min(4).default(3000),
    BACKEND_PORT: z.coerce.number().int().positive().min(4).default(3002),
    SECRET_KEY: z.string().min(16)
});

const parsed = z.safeParse(envSchema, process.env);

if (!parsed.success){
    console.error("Invalid environment variables:", parsed.error.message);
    process.exit(1);
}

export const env = parsed.data;

