const [add, razy] = require('../functions');

describe('Testy funkcji matematycznych', () => {
    test('add(5, 7) powinno zwrócić 12', () => {
        expect(add(5, 7)).toBe(12);
    });

    test('razy(5, 7) powinno zwrócić 35', () => {
        expect(razy(5, 7)).toBe(35);
    });

    test('add działa z liczbami ujemnymi', () => {
        expect(add(-2, -3)).toBe(-5);
    });

    test('razy działa z zerem', () => {
        expect(razy(0, 10)).toBe(0);
    });
});