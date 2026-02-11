import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Contest {
    id: string;
    title: string;
    organization: string;
    scope: string;
    grade: string;
    deadline: string;
    prize: string;
    description: string;
    requirements: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Helper to convert requirements array to JSON string for storage
const serializeRequirements = (requirements: string[]): string => {
    return JSON.stringify(requirements);
};

// Helper to convert JSON string back to requirements array
const deserializeRequirements = (requirementsJson: string): string[] => {
    return JSON.parse(requirementsJson);
};

const createContest = async (contest: Contest) => {
    const contestData = {
        ...contest,
        requirements: serializeRequirements(contest.requirements),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const newContest = await prisma.contest.create({
        data: contestData
    });
    // Deserialize requirements for return
    return {
        ...newContest,
        requirements: deserializeRequirements(newContest.requirements),
    };
};

const getContest = async (id: string) => {
    const contest = await prisma.contest.findUnique({
        where: { id }
    });
    if (!contest) return null;
    // Deserialize requirements
    return {
        ...contest,
        requirements: deserializeRequirements(contest.requirements),
    };
};

const getAllContests = async () => {
    const contests = await prisma.contest.findMany({
        orderBy: { createdAt: 'desc' }
    });
    // Deserialize requirements for all contests
    return contests.map(contest => ({
        ...contest,
        requirements: deserializeRequirements(contest.requirements),
    }));
};

const updateContest = async (contest: Contest) => {
    // Check if contest exists first
    const existingContest = await prisma.contest.findUnique({
        where: { id: contest.id }
    });

    if (!existingContest) {
        throw new Error(`Contest with id ${contest.id} not found`);
    }

    const { id, createdAt, ...rest } = contest;
    const contestData = {
        ...rest,
        requirements: serializeRequirements(contest.requirements),
        updatedAt: new Date(),
    };
    const updatedContest = await prisma.contest.update({
        where: { id },
        data: contestData
    });
    // Deserialize requirements for return
    return {
        ...updatedContest,
        requirements: deserializeRequirements(updatedContest.requirements),
    };
};

const deleteContest = async (id: string) => {
    const deletedContest = await prisma.contest.delete({
        where: { id }
    });
    // Deserialize requirements for return
    return {
        ...deletedContest,
        requirements: deserializeRequirements(deletedContest.requirements),
    };
};

export { createContest, getContest, getAllContests, updateContest, deleteContest };

