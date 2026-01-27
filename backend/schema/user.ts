import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface User {
    id: string;
    auth0Id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    leaderboardScore: number;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Find user by Auth0 ID, or create if doesn't exist
const findOrCreateUserByAuth0Id = async (auth0Id: string, email: string) => {
    // Try to find existing user
    let user = await prisma.user.findUnique({
        where: { auth0Id }
    });

    if (!user) {
        // Create new user with Auth0 data
        user = await prisma.user.create({
            data: {
                auth0Id,
                email,
                firstName: null,
                lastName: null,
                leaderboardScore: 0,
                role: 'user',
            }
        });
    }

    return user;
};

const getUserByAuth0Id = async (auth0Id: string) => {
    const user = await prisma.user.findUnique({
        where: { auth0Id }
    });
    return user;
};

const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });
    return user;
};

const deleteUser = async (id: string) => {
    const deletedUser = await prisma.user.delete({
        where: { id }
    });
    return deletedUser;
};

const deleteUserByAuth0Id = async (auth0Id: string) => {
    const deletedUser = await prisma.user.delete({
        where: { auth0Id }
    });
    return deletedUser;
};

interface UserUpdateData {
    firstName?: string | null;
    lastName?: string | null;
    email?: string;
    leaderboardScore?: number;
    role?: string;
}

const updateUser = async (id: string, data: UserUpdateData) => {
    const updatedUser = await prisma.user.update({
        where: { id },
        data
    });
    return updatedUser;
};

const updateUserByAuth0Id = async (auth0Id: string, data: UserUpdateData) => {
    const updatedUser = await prisma.user.update({
        where: { auth0Id },
        data
    });
    return updatedUser;
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
            auth0Id: true,
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

export { 
    findOrCreateUserByAuth0Id,
    getUserByAuth0Id,
    getUserById,
    deleteUser, 
    deleteUserByAuth0Id,
    updateUser, 
    updateUserByAuth0Id,
    getUserByEmail, 
    getTopUsers 
};
