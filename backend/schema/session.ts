import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Session {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
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

const validateSession = async (id: string) => {
    const session = await getSession(id);
    
    if (!session) {
        return null;
    }
    
    // Check if session has expired
    if (session.expiresAt < new Date()) {
        // Optionally delete expired session (handle error if already deleted)
        try {
            await deleteSession(id);
        } catch (error) {
            // Session might already be deleted, ignore error
        }
        return null;
    }
    
    return session;
}

const sanitizeSession = (session: any) => {
    const { user, expiresAt, createdAt, updatedAt, ...safeSession } = session;
    return safeSession;
}   

export { createSession, deleteSession, getSession, validateSession, sanitizeSession };