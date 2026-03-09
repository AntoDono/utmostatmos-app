import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface User {
    id: string;
    auth0Id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    leaderboardScore: number;
    role: string;
    loginStreak: number;
    lastLoginAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

// Find user by Auth0 ID, or create if doesn't exist
const findOrCreateUserByAuth0Id = async (
    auth0Id: string, 
    email: string | null,
    firstName?: string | null,
    lastName?: string | null
) => {
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
                firstName: firstName || null,
                lastName: lastName || null,
                leaderboardScore: 0,
                role: 'user',
                loginStreak: 0,
                lastLoginAt: null,
            }
        });
    } else if (firstName || lastName) {
        // Update existing user's name if provided and different
        const needsUpdate = 
            (firstName && user.firstName !== firstName) ||
            (lastName && user.lastName !== lastName) ||
            (email && user.email !== email);
        
        if (needsUpdate) {
            user = await prisma.user.update({
                where: { auth0Id },
                data: {
                    ...(firstName && { firstName }),
                    ...(lastName && { lastName }),
                    ...(email && { email }),
                }
            });
        }
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
    loginStreak?: number;
    lastLoginAt?: Date | null;
}

/** Returns date at midnight UTC for comparison. */
function toDateOnlyUTC(d: Date): number {
    const x = new Date(d);
    x.setUTCHours(0, 0, 0, 0);
    return x.getTime();
}

/**
 * Records a login for today and updates streak for consecutive days.
 * Call when the user hits an authenticated endpoint (e.g. GET /auth/profile).
 * - First login ever or after a gap: streak = 1
 * - Login yesterday then today: streak += 1
 * - Already logged in today: no change
 */
const recordLoginAndUpdateStreak = async (auth0Id: string) => {
    const user = await prisma.user.findUnique({
        where: { auth0Id },
    });
    if (!user) return null;

    const now = new Date();
    const todayUTC = toDateOnlyUTC(now);
    const yesterdayUTC = toDateOnlyUTC(new Date(now.getTime() - 24 * 60 * 60 * 1000));
    const lastLoginAt = user.lastLoginAt ? toDateOnlyUTC(user.lastLoginAt) : null;

    let newStreak = user.loginStreak;
    if (lastLoginAt === null) {
        newStreak = 1;
    } else if (lastLoginAt === yesterdayUTC) {
        newStreak = user.loginStreak + 1;
    } else if (lastLoginAt === todayUTC) {
        return user; // already counted today
    } else {
        newStreak = 1; // gap in days, reset streak
    }

    const updated = await prisma.user.update({
        where: { auth0Id },
        data: { loginStreak: newStreak, lastLoginAt: now },
    });
    return updated;
};

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

/**
 * Returns the user's global leaderboard rank based on leaderboardScore.
 * Rank is 1 + number of users with a strictly higher score.
 */
const getUserRankByAuth0Id = async (auth0Id: string) => {
    const user = await prisma.user.findUnique({
        where: { auth0Id },
    });
    if (!user) return null;

    const higherCount = await prisma.user.count({
        where: {
            leaderboardScore: { gt: user.leaderboardScore },
        },
    });

    return {
        user,
        rank: higherCount + 1,
    };
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
    getTopUsers,
    recordLoginAndUpdateStreak,
    getUserRankByAuth0Id,
};
