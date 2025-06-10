const request = require('supertest');
let app;

beforeAll(() => {
    app = require('express')();

    const [add, razy] = require('../functions');

    app.get('/api/status', (req, res) => {
        res.json({
            version: process.version,
            status: 'health',
        });
    });

    app.get('/api/data', (req, res) => {
        let a = add(5, 7);
        let b = razy(5, 7);
        res.json({ add_5_7: a, razy_5_7: b });
    });
});

describe('Testy endpointów API', () => {
    test('GET /api/status powinno zwrócić status "health"', async () => {
        const res = await request(app).get('/api/status');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('health');
        expect(res.body.version).toMatch(/^v\d+\./);
    });

    test('GET /api/data powinno zwrócić poprawne wartości add i razy', async () => {
        const res = await request(app).get('/api/data');
        expect(res.statusCode).toBe(200);
        expect(res.body.add_5_7).toBe(12);
        expect(res.body.razy_5_7).toBe(35);
    });
});
