// UpdateProfileBody, ChangePasswordBody

import { error } from 'node:console';
import z from 'zod';

export const UpdateProfileBody = z.object({
    id: z.uuid("Invalid UUID format"),
    firstName: z.string().regex(/^[^0-9]*$/, {error: "Name cannot contain numbers"})
    .min(1,'First name should be minimum 1 character')
    .max(50,'First name can be max 50 characters'),
    lastName: z.string().regex(/^[^0-9]*$/, {error: "Name cannot contain numbers"})
    .min(1,'Last name should be minimum 1 character').max(50, 'Last name can be max 50 characters'),
    email: z.string().trim().toLowerCase().pipe(z.email({error: 'Invalid email address'})),
    currentRole: z.string().max(100,'Max 100 characters allowed'),
    targetRole: z.string().max(100,'Max 100 characters allowed'),
    weeklyHours: z.number().positive({error: 'Should be a positive number'}).min(2, 'Min hours cannot be less than 2 hours').max(20, 'Max hours cannot exceed 40 hours per week'),
    targetMonths: z.union([z.literal(3), z.literal(6), z.literal(12)], {error: 'Select 3,6 or 12 months'}),
    onboardingDone: z.boolean(),
    createdAt: z.date()
})


export const ChangePasswordBody = z.object({
    currentPassword: z.string({error: 'Current password is required'}),
    newPassword: z.string().min(8, 'Minimum 8 characters are required').max(72, 'Maximum 72 characters are allowed')
})



