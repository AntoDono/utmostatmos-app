import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Tracker {
    id: string;
    type: string;
    name: string;
    longitude: number;
    latitude: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const createTracker = async (tracker: Tracker) => {
    const trackerData = {
        ...tracker,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const newTracker = await prisma.tracker.create({
        data: trackerData
    });
    return newTracker;
};

const getTracker = async (id: string) => {
    const tracker = await prisma.tracker.findUnique({
        where: { id }
    });
    return tracker;
};

const getAllTrackers = async () => {
    const trackers = await prisma.tracker.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return trackers;
};

const getTrackersByType = async (type: string) => {
    const trackers = await prisma.tracker.findMany({
        where: { type },
        orderBy: { createdAt: 'desc' }
    });
    return trackers;
};

const updateTracker = async (tracker: Tracker) => {
    const { id, createdAt, ...rest } = tracker;
    const trackerData = {
        ...rest,
        updatedAt: new Date(),
    };
    const updatedTracker = await prisma.tracker.update({
        where: { id },
        data: trackerData
    });
    return updatedTracker;
};

const deleteTracker = async (id: string) => {
    const deletedTracker = await prisma.tracker.delete({
        where: { id }
    });
    return deletedTracker;
};

export { createTracker, getTracker, getAllTrackers, getTrackersByType, updateTracker, deleteTracker };

