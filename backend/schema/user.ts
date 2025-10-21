import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    verificationToken: string | null;
    passwordResetToken: string | null;
    leaderboardScore: number;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const createUser = async (user: User) => {
    user.createdAt = new Date()
    user.updatedAt = new Date()
    const newUser = await prisma.user.create({
        data: user
    });
    return newUser;
}

const deleteUser = async (id: string) => {
    const deletedUser = await prisma.user.delete({
        where: { id }
    });
    return deletedUser;
}

const updateUser = async (user: User) => {
    const { id, createdAt, ...rest } = user;
    user.updatedAt = new Date();

    const updatedUser = await prisma.user.update({
        where: { id },
        data: rest // this will exclude createdAt from being updated
    });
    return updatedUser;
}

// Utility function to safely serialize user data without sensitive fields
const sanitizeUser = (user: any) => {
    const { password, emailVerified, verificationToken, passwordResetToken, ...safeUser } = user;
    return safeUser;
};

export { createUser, deleteUser, updateUser, sanitizeUser };