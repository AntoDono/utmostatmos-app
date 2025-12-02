import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface BinQuiz {
    id: string;
    item: string;
    choices: string[];
    answer: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Helper to convert choices array to JSON string for storage
const serializeChoices = (choices: string[]): string => {
    return JSON.stringify(choices);
};

// Helper to convert JSON string back to choices array
const deserializeChoices = (choicesJson: string): string[] => {
    return JSON.parse(choicesJson);
};

const createBinQuiz = async (binQuiz: BinQuiz) => {
    const quizData = {
        ...binQuiz,
        choices: serializeChoices(binQuiz.choices),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const newQuiz = await prisma.binQuiz.create({
        data: quizData
    });
    // Deserialize choices for return
    return {
        ...newQuiz,
        choices: deserializeChoices(newQuiz.choices),
    };
};

const getBinQuiz = async (id: string) => {
    const quiz = await prisma.binQuiz.findUnique({
        where: { id }
    });
    if (!quiz) return null;
    // Deserialize choices
    return {
        ...quiz,
        choices: deserializeChoices(quiz.choices),
    };
};

const getAllBinQuizzes = async () => {
    const quizzes = await prisma.binQuiz.findMany({
        orderBy: { createdAt: 'desc' }
    });
    // Deserialize choices for all quizzes
    return quizzes.map(quiz => ({
        ...quiz,
        choices: deserializeChoices(quiz.choices),
    }));
};

const getBinQuizzesWithLimit = async (limit: number) => {
    const quizzes = await prisma.binQuiz.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' }
    });
    // Deserialize choices for all quizzes
    return quizzes.map(quiz => ({
        ...quiz,
        choices: deserializeChoices(quiz.choices),
    }));
};

const updateBinQuiz = async (binQuiz: BinQuiz) => {
    // Check if quiz exists first
    const existingQuiz = await prisma.binQuiz.findUnique({
        where: { id: binQuiz.id }
    });
    
    if (!existingQuiz) {
        throw new Error(`BinQuiz with id ${binQuiz.id} not found`);
    }
    
    const { id, createdAt, ...rest } = binQuiz;
    const quizData = {
        ...rest,
        choices: serializeChoices(binQuiz.choices),
        updatedAt: new Date(),
    };
    const updatedQuiz = await prisma.binQuiz.update({
        where: { id },
        data: quizData
    });
    // Deserialize choices for return
    return {
        ...updatedQuiz,
        choices: deserializeChoices(updatedQuiz.choices),
    };
};

const deleteBinQuiz = async (id: string) => {
    const deletedQuiz = await prisma.binQuiz.delete({
        where: { id }
    });
    // Deserialize choices for return
    return {
        ...deletedQuiz,
        choices: deserializeChoices(deletedQuiz.choices),
    };
};

export { createBinQuiz, getBinQuiz, getAllBinQuizzes, getBinQuizzesWithLimit, updateBinQuiz, deleteBinQuiz };

