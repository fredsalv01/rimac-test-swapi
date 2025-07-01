// test/routes.test.ts
import express from 'express';
import request from 'supertest';
import { registerRoutes } from '../src/routes';

import { DynamoDBCacheRepository } from '../src/infrastructure/cache/dynamo-cache.repository';
import { DynamoDBCustomDataRepository } from '../src/infrastructure/dynamodb/custom-data.repository';
import { MySQLHistoryDataRepository } from '../src/infrastructure/RDS/history-data-mysql.repository';
import { SwapiCharacterRepository } from '../src/infrastructure/swapi/swapi-character.repository';
import { PokeApiRepository } from '../src/infrastructure/pokeapi/pokeapi.repository';

// Mocks
jest.mock('../src/infrastructure/cache/dynamo-cache.repository');
jest.mock('../src/infrastructure/dynamodb/custom-data.repository');
jest.mock('../src/infrastructure/RDS/history-data-mysql.repository');
jest.mock('../src/infrastructure/swapi/swapi-character.repository');
jest.mock('../src/infrastructure/pokeapi/pokeapi.repository');

describe('Routes integration', () => {
  const app = express();
  app.use(express.json());
  registerRoutes(app);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /fusionados', () => {
    it('devuelve datos fusionados y los guarda correctamente', async () => {
      (SwapiCharacterRepository as jest.Mock).mockImplementation(() => ({
        getCharacters: jest.fn().mockResolvedValue({
          total: 1,
          data: [{ name: 'Luke', height: '172', gender: 'male', birth_year: '19BBY' }]
        })
      }));
      (PokeApiRepository as jest.Mock).mockImplementation(() => ({
        getPokemonTeam: jest.fn().mockResolvedValue(['Pikachu', 'Charmander'])
      }));
      const getCacheMock = jest.fn().mockResolvedValue(null);
      const setCacheMock = jest.fn().mockResolvedValue(undefined);
      (DynamoDBCacheRepository as jest.Mock).mockImplementation(() => ({
        getCache: getCacheMock,
        setCache: setCacheMock
      }));
      const saveHistoryMock = jest.fn().mockResolvedValue(undefined);
      (MySQLHistoryDataRepository as jest.Mock).mockImplementation(() => ({
        history: jest.fn(), // no necesitamos en esta ruta
        save: saveHistoryMock
      }));

      const res = await request(app).get('/fusionados?page=1&limit=1');
      expect(res.status).toBe(200);
      expect(res.body.data[0]).toMatchObject({
        name: 'Luke',
        pokemon_team: ['Pikachu', 'Charmander']
      });
      expect(getCacheMock).toHaveBeenCalled();
      expect(setCacheMock).toHaveBeenCalled();
      expect(saveHistoryMock).toHaveBeenCalledWith(res.body.data);
    });
  });

  describe('POST /almacenar', () => {
    it('retorna 400 en body inválido', async () => {
      const res = await request(app).post('/almacenar').send('');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'El contenido a almacenar es invalido.' });
    });

    it('retorna 201 y formatea fecha al guardar', async () => {
      const saveResult = {
        createdAt: new Date(),
        data: { foo: 'bar' }
      };
      const saveMock = jest.fn().mockResolvedValue(saveResult);
      (DynamoDBCustomDataRepository as jest.Mock).mockImplementation(() => ({
        save: saveMock
      }));

      const res = await request(app).post('/almacenar').send({ foo: 'bar' });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Datos guardados exitosamente');
      expect(res.body.data).toMatchObject({ foo: 'bar', createdAt: expect.any(String) });
      expect(saveMock).toHaveBeenCalledWith({ foo: 'bar' });
    });
  });

  describe('GET /historial', () => {
    it('retorna historial con paginación y formato correcto', async () => {
      const items = [{
        id: 'uuid-1',
        mergeData: '[{"name":"A"}]',
        createdAt: new Date('2025-01-01T12:00:00Z')
      }];
      const historyMock = jest.fn().mockResolvedValue({ items, total: 1 });
      (MySQLHistoryDataRepository as jest.Mock).mockImplementation(() => ({
        history: historyMock
      }));

      const res = await request(app).get('/historial?page=2&limit=5');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        limit: 5,
        page: 2,
        totalItems: 1,
        data: [{
          id: 'uuid-1',
          mergeData: '[{"name":"A"}]',
          createdAt: expect.any(String)
        }]
      });
      expect(historyMock).toHaveBeenCalledWith(2, 5);
    });
  });
});
