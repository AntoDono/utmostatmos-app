import { PrismaClient } from '@prisma/client';

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
    const { password, verificationToken, passwordResetToken, ...safeUser } = user;
    return safeUser;
};

const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    return user;
};

const getTopUsers = async (limit: number = 10) => {
    const users = await prisma.user.findMany({
        take: limit,
        orderBy: { leaderboardScore: 'desc' },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            leaderboardScore: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return users;
};

export { createUser, deleteUser, updateUser, sanitizeUser, getUserByEmail, getTopUsers };