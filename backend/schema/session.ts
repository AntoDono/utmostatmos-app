import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export interface Session {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const createSession = async (session: Session) => {
    const newSession = await prisma.session.create({
        data: session
    });
    return newSession;
}

const deleteSession = async (id: string) => {
    const deletedSession = await prisma.session.delete({
        where: { id }
    });
    return deletedSession;
}

const getSession = async (id: string) => {
    const session = await prisma.session.findUnique({
        where: { id }
    });
    return session;
}

const sanitizeSession = (session: any) => {
    const { user, expiresAt, createdAt, updatedAt, ...safeSession } = session;
    return safeSession;
}   

export { createSession, deleteSession, getSession, sanitizeSession };