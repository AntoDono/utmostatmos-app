import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { app } from '../server.js';
import {
  createBinQuiz,
  getBinQuiz,
  getAllBinQuizzes,
  updateBinQuiz,
  deleteBinQuiz,
} from '../schema/binQuiz.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

describe('BinQuiz Schema Functions', () => {
  describe('createBinQuiz', () => {
    it('should create a new bin quiz successfully', async () => {
      const quizData = {
        id: uuidv4(),
        item: 'banana',
        choices: ['Compost', 'Recycling', 'Trash', 'Donate'],
        answer: 'Compost',
      };

      const createdQuiz = await createBinQuiz(quizData);

      expect(createdQuiz).toHaveProperty('id');
      expect(createdQuiz.item).toBe(quizData.item);
      expect(createdQuiz.choices).toEqual(quizData.choices);
      expect(createdQuiz.answer).toBe(quizData.answer);
      expect(createdQuiz.createdAt).toBeInstanceOf(Date);
      expect(createdQuiz.updatedAt).toBeInstanceOf(Date);

      // Verify choices are returned as array (not JSON string)
      expect(Array.isArray(createdQuiz.choices)).toBe(true);
      expect(createdQuiz.choices.length).toBe(4);

      // Verify it's stored in database with JSON string
      const dbQuiz = await prisma.binQuiz.findUnique({
        where: { id: createdQuiz.id },
      });
      expect(dbQuiz).toBeTruthy();
      expect(typeof dbQuiz?.choices).toBe('string'); // Stored as JSON string
      expect(JSON.parse(dbQuiz!.choices)).toEqual(quizData.choices);
    });

    it('should handle multiple choices correctly', async () => {
      const quizData = {
        id: uuidv4(),
        item: 'plastic bottle',
        choices: ['Recycling', 'Trash', 'Compost', 'Hazardous Waste'],
        answer: 'Recycling',
      };

      const createdQuiz = await createBinQuiz(quizData);

      expect(createdQuiz.choices).toHaveLength(4);
      expect(createdQuiz.choices).toContain('Recycling');
      expect(createdQuiz.choices).toContain('Trash');
    });

    it('should handle single choice array', async () => {
      const quizData = {
        id: uuidv4(),
        item: 'test item',
        choices: ['Only Choice'],
        answer: 'Only Choice',
      };

      const createdQuiz = await createBinQuiz(quizData);

      expect(createdQuiz.choices).toHaveLength(1);
      expect(createdQuiz.choices[0]).toBe('Only Choice');
    });

    it('should throw error if required fields are missing', async () => {
      const invalidQuiz = {
        id: uuidv4(),
        item: 'test',
        choices: ['Choice1'],
        // answer is missing
      } as any;

      await expect(createBinQuiz(invalidQuiz)).rejects.toThrow();
    });
  });

  describe('getBinQuiz', () => {
    it('should retrieve a bin quiz by id', async () => {
      // Create a quiz first
      const quizData = {
        id: uuidv4(),
        item: 'newspaper',
        choices: ['Recycling', 'Trash', 'Compost', 'Donate'],
        answer: 'Recycling',
      };

      const createdQuiz = await createBinQuiz(quizData);
      const retrievedQuiz = await getBinQuiz(createdQuiz.id);

      expect(retrievedQuiz).toBeTruthy();
      expect(retrievedQuiz?.id).toBe(createdQuiz.id);
      expect(retrievedQuiz?.item).toBe(quizData.item);
      expect(retrievedQuiz?.choices).toEqual(quizData.choices);
      expect(retrievedQuiz?.answer).toBe(quizData.answer);
      expect(Array.isArray(retrievedQuiz?.choices)).toBe(true);
    });

    it('should return null for non-existent quiz', async () => {
      const nonExistentId = uuidv4();
      const quiz = await getBinQuiz(nonExistentId);

      expect(quiz).toBeNull();
    });

    it('should deserialize choices correctly', async () => {
      const quizData = {
        id: uuidv4(),
        item: 'cardboard',
        choices: ['Recycling', 'Compost', 'Trash'],
        answer: 'Recycling',
      };

      const createdQuiz = await createBinQuiz(quizData);
      const retrievedQuiz = await getBinQuiz(createdQuiz.id);

      expect(retrievedQuiz?.choices).toBeInstanceOf(Array);
      expect(retrievedQuiz?.choices).toEqual(quizData.choices);
    });
  });

  describe('getAllBinQuizzes', () => {
    it('should retrieve all bin quizzes', async () => {
      // Create multiple quizzes
      const quiz1 = await createBinQuiz({
        id: uuidv4(),
        item: 'item1',
        choices: ['Choice1', 'Choice2'],
        answer: 'Choice1',
      });

      const quiz2 = await createBinQuiz({
        id: uuidv4(),
        item: 'item2',
        choices: ['ChoiceA', 'ChoiceB'],
        answer: 'ChoiceA',
      });

      const allQuizzes = await getAllBinQuizzes();

      expect(allQuizzes.length).toBeGreaterThanOrEqual(2);
      expect(allQuizzes.some(q => q.id === quiz1.id)).toBe(true);
      expect(allQuizzes.some(q => q.id === quiz2.id)).toBe(true);

      // Verify all quizzes have deserialized choices
      allQuizzes.forEach(quiz => {
        expect(Array.isArray(quiz.choices)).toBe(true);
      });
    });

    it('should return empty array when no quizzes exist', async () => {
      // This test depends on beforeEach clearing the database
      const allQuizzes = await getAllBinQuizzes();
      expect(Array.isArray(allQuizzes)).toBe(true);
    });

    it('should return quizzes ordered by createdAt desc', async () => {
      const quiz1 = await createBinQuiz({
        id: uuidv4(),
        item: 'older',
        choices: ['A', 'B'],
        answer: 'A',
      });

      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));

      const quiz2 = await createBinQuiz({
        id: uuidv4(),
        item: 'newer',
        choices: ['C', 'D'],
        answer: 'C',
      });

      const allQuizzes = await getAllBinQuizzes();

      // Newer quiz should be first
      expect(allQuizzes[0].id).toBe(quiz2.id);
    });
  });

  describe('updateBinQuiz', () => {
    it('should update a bin quiz successfully', async () => {
      const quizData = {
        id: uuidv4(),
        item: 'original item',
        choices: ['Original1', 'Original2'],
        answer: 'Original1',
      };

      const createdQuiz = await createBinQuiz(quizData);

      const updatedData = {
        ...createdQuiz,
        item: 'updated item',
        choices: ['Updated1', 'Updated2', 'Updated3'],
        answer: 'Updated2',
      };

      const updatedQuiz = await updateBinQuiz(updatedData);

      expect(updatedQuiz.id).toBe(createdQuiz.id);
      expect(updatedQuiz.item).toBe('updated item');
      expect(updatedQuiz.choices).toEqual(['Updated1', 'Updated2', 'Updated3']);
      expect(updatedQuiz.answer).toBe('Updated2');
      expect(updatedQuiz.updatedAt.getTime()).toBeGreaterThanOrEqual(createdQuiz.updatedAt.getTime());
    });

    it('should update only specified fields', async () => {
      const quizData = {
        id: uuidv4(),
        item: 'test item',
        choices: ['A', 'B', 'C'],
        answer: 'A',
      };

      const createdQuiz = await createBinQuiz(quizData);
      const originalUpdatedAt = createdQuiz.updatedAt;

      // Wait a bit to ensure updatedAt changes
      await new Promise(resolve => setTimeout(resolve, 10));

      const updatedData = {
        ...createdQuiz,
        answer: 'B', // Only change answer
      };

      const updatedQuiz = await updateBinQuiz(updatedData);

      expect(updatedQuiz.item).toBe(quizData.item); // Unchanged
      expect(updatedQuiz.choices).toEqual(quizData.choices); // Unchanged
      expect(updatedQuiz.answer).toBe('B'); // Changed
      expect(updatedQuiz.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

    it('should throw error if quiz does not exist', async () => {
      const nonExistentQuiz = {
        id: uuidv4(),
        item: 'non-existent',
        choices: ['A', 'B'],
        answer: 'A',
      };

      await expect(updateBinQuiz(nonExistentQuiz)).rejects.toThrow();
    });
  });

  describe('deleteBinQuiz', () => {
    it('should delete a bin quiz successfully', async () => {
      const quizData = {
        id: uuidv4(),
        item: 'to delete',
        choices: ['A', 'B'],
        answer: 'A',
      };

      const createdQuiz = await createBinQuiz(quizData);
      const deletedQuiz = await deleteBinQuiz(createdQuiz.id);

      expect(deletedQuiz.id).toBe(createdQuiz.id);
      expect(deletedQuiz.choices).toEqual(quizData.choices); // Should be deserialized

      // Verify it's deleted from database
      const dbQuiz = await prisma.binQuiz.findUnique({
        where: { id: createdQuiz.id },
      });
      expect(dbQuiz).toBeNull();
    });

    it('should throw error if quiz does not exist', async () => {
      const nonExistentId = uuidv4();

      await expect(deleteBinQuiz(nonExistentId)).rejects.toThrow();
    });

    it('should return deserialized choices after deletion', async () => {
      const quizData = {
        id: uuidv4(),
        item: 'test',
        choices: ['Choice1', 'Choice2', 'Choice3'],
        answer: 'Choice1',
      };

      const createdQuiz = await createBinQuiz(quizData);
      const deletedQuiz = await deleteBinQuiz(createdQuiz.id);

      expect(Array.isArray(deletedQuiz.choices)).toBe(true);
      expect(deletedQuiz.choices).toEqual(quizData.choices);
    });
  });

  describe('JSON Serialization/Deserialization', () => {
    it('should correctly serialize choices array to JSON string in database', async () => {
      const quizData = {
        id: uuidv4(),
        item: 'test item',
        choices: ['Option A', 'Option B', 'Option C'],
        answer: 'Option A',
      };

      const createdQuiz = await createBinQuiz(quizData);

      // Check database directly
      const dbQuiz = await prisma.binQuiz.findUnique({
        where: { id: createdQuiz.id },
      });

      expect(dbQuiz).toBeTruthy();
      expect(typeof dbQuiz?.choices).toBe('string');
      const parsedChoices = JSON.parse(dbQuiz!.choices);
      expect(parsedChoices).toEqual(quizData.choices);
    });

    it('should correctly deserialize JSON string to array when retrieving', async () => {
      // Insert directly into database with JSON string
      const quizId = uuidv4();
      await prisma.binQuiz.create({
        data: {
          id: quizId,
          item: 'direct insert',
          choices: JSON.stringify(['Direct1', 'Direct2']),
          answer: 'Direct1',
        },
      });

      const retrievedQuiz = await getBinQuiz(quizId);

      expect(retrievedQuiz).toBeTruthy();
      expect(Array.isArray(retrievedQuiz?.choices)).toBe(true);
      expect(retrievedQuiz?.choices).toEqual(['Direct1', 'Direct2']);
    });

    it('should handle empty choices array', async () => {
      const quizData = {
        id: uuidv4(),
        item: 'empty choices',
        choices: [],
        answer: 'answer',
      };

      const createdQuiz = await createBinQuiz(quizData);

      expect(createdQuiz.choices).toEqual([]);
      expect(Array.isArray(createdQuiz.choices)).toBe(true);
    });

    it('should handle special characters in choices', async () => {
      const quizData = {
        id: uuidv4(),
        item: 'special chars',
        choices: ['Option "A"', "Option 'B'", 'Option & C'],
        answer: 'Option "A"',
      };

      const createdQuiz = await createBinQuiz(quizData);
      const retrievedQuiz = await getBinQuiz(createdQuiz.id);

      expect(retrievedQuiz?.choices).toEqual(quizData.choices);
      expect(retrievedQuiz?.choices[0]).toBe('Option "A"');
    });
  });

  describe('GET /quiz route', () => {
    it('should return quizzes with default limit of 10', async () => {
      // Create 15 quizzes
      for (let i = 0; i < 15; i++) {
        await createBinQuiz({
          id: uuidv4(),
          item: `item${i}`,
          choices: ['Choice1', 'Choice2', 'Choice3'],
          answer: 'Choice1',
        });
      }

      const response = await request(app)
        .get('/quiz')
        .expect(200);

      expect(response.body).toHaveProperty('quizzes');
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('limit');
      expect(response.body.limit).toBe(10);
      expect(response.body.quizzes).toHaveLength(10);
      expect(response.body.count).toBe(10);

      // Verify quizzes have correct structure
      response.body.quizzes.forEach((quiz: any) => {
        expect(quiz).toHaveProperty('id');
        expect(quiz).toHaveProperty('item');
        expect(quiz).toHaveProperty('choices');
        expect(quiz).toHaveProperty('answer');
        expect(Array.isArray(quiz.choices)).toBe(true);
      });
    });

    it('should return specified number of quizzes when limit is provided', async () => {
      // Create 10 quizzes
      for (let i = 0; i < 10; i++) {
        await createBinQuiz({
          id: uuidv4(),
          item: `item${i}`,
          choices: ['A', 'B', 'C'],
          answer: 'A',
        });
      }

      const response = await request(app)
        .get('/quiz?limit=5')
        .expect(200);

      expect(response.body.limit).toBe(5);
      expect(response.body.quizzes).toHaveLength(5);
      expect(response.body.count).toBe(5);
    });

    it('should return all quizzes when limit exceeds available count', async () => {
      // Create 3 quizzes
      for (let i = 0; i < 3; i++) {
        await createBinQuiz({
          id: uuidv4(),
          item: `item${i}`,
          choices: ['A', 'B'],
          answer: 'A',
        });
      }

      const response = await request(app)
        .get('/quiz?limit=10')
        .expect(200);

      expect(response.body.limit).toBe(10);
      expect(response.body.quizzes).toHaveLength(3);
      expect(response.body.count).toBe(3);
    });

    it('should enforce max limit of 100', async () => {
      // Create 150 quizzes
      for (let i = 0; i < 150; i++) {
        await createBinQuiz({
          id: uuidv4(),
          item: `item${i}`,
          choices: ['A', 'B'],
          answer: 'A',
        });
      }

      const response = await request(app)
        .get('/quiz?limit=200')
        .expect(200);

      expect(response.body.limit).toBe(100);
      expect(response.body.quizzes).toHaveLength(100);
      expect(response.body.count).toBe(100);
    });

    it('should return 400 for invalid limit (negative number)', async () => {
      const response = await request(app)
        .get('/quiz?limit=-5')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Limit must be a positive number');
    });

    it('should return 400 for invalid limit (zero)', async () => {
      const response = await request(app)
        .get('/quiz?limit=0')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Limit must be a positive number');
    });

    it('should return 400 for invalid limit (non-numeric)', async () => {
      const response = await request(app)
        .get('/quiz?limit=abc')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Limit must be a positive number');
    });

    it('should return empty array when no quizzes exist', async () => {
      const response = await request(app)
        .get('/quiz')
        .expect(200);

      expect(response.body.quizzes).toEqual([]);
      expect(response.body.count).toBe(0);
      expect(response.body.limit).toBe(10);
    });

    it('should return quizzes with deserialized choices', async () => {
      const quiz = await createBinQuiz({
        id: uuidv4(),
        item: 'test item',
        choices: ['Compost', 'Recycling', 'Trash'],
        answer: 'Compost',
      });

      const response = await request(app)
        .get('/quiz?limit=1')
        .expect(200);

      expect(response.body.quizzes[0].choices).toEqual(['Compost', 'Recycling', 'Trash']);
      expect(Array.isArray(response.body.quizzes[0].choices)).toBe(true);
    });

    it('should return quizzes ordered by createdAt desc', async () => {
      const quiz1 = await createBinQuiz({
        id: uuidv4(),
        item: 'older',
        choices: ['A', 'B'],
        answer: 'A',
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      const quiz2 = await createBinQuiz({
        id: uuidv4(),
        item: 'newer',
        choices: ['C', 'D'],
        answer: 'C',
      });

      const response = await request(app)
        .get('/quiz?limit=2')
        .expect(200);

      // Newer quiz should be first
      expect(response.body.quizzes[0].id).toBe(quiz2.id);
      expect(response.body.quizzes[1].id).toBe(quiz1.id);
    });
  });
});

