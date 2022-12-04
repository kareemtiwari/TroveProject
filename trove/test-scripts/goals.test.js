const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("Testing the creation of a goal", () => {
    test("It should respond by redirect", async () => {
        const form = {
            'goalID': 'option1',
            'goalAmount':'2000',
            'goalProgress': '20',
            'goalName': 'New car',
            'goalSlider': '50'
        };
        const response = await request(baseURL).post("/TroveAccounting/add").send(form);
        expect(response.statusCode).toBe(302);

    });
});
describe("Testing the deletion of a goal", () => {
    test("It should respond by redirect", async () => {
        const form = {
            'goalID': 'option1',
        };
        const response = await request(baseURL).post("/TroveAccounting/delete").send(form);
        expect(response.statusCode).toBe(302);

    });
});
describe("Testing the adding of funds to a goal", () => {
    test("It should respond by redirect", async () => {
        const form = {
            'goalID': 'option1',
            'goalAmount':'2000',
            'gProgress': '20',
            'goalProgress': '20',
            'goalName': 'New car',
            'goalSlider': '50'
        };
        const response = await request(baseURL).post("/TroveAccounting/addFunds").send(form);
        expect(response.statusCode).toBe(302);

    });
});
describe("Testing the deletion of funds to a goal", () => {
    test("It should respond by redirect", async () => {
        const form = {
            'goalID': 'option1',
            'goalAmount':'2000',
            'gProgress': '20',
            'goalProgress': '20',
            'goalName': 'New car',
            'goalSlider': '50'
        };
        const response = await request(baseURL).post("/TroveAccounting/deleteFunds").send(form);
        expect(response.statusCode).toBe(302);

    });
});
describe("Testing the adding a goal with an empty field", () => {
    test("It should respond by redirect", async () => {
        const form = {
            'goalID': 'option1',
            'goalAmount':'',
            'goalProgress': '20',
            'goalName': 'New car',
            'goalSlider': '50'
        };
        const response = await request(baseURL).post("/TroveAccounting/add").send(form);
        cookie = response.headers['set-cookie'];
        expect(response['text']).toContain('Found.')

    });
});
describe("Testing the adding a goal with an empty field #2", () => {
    test("It should respond by redirect", async () => {
        const form = {
            'goalID': 'option1',
            'goalAmount':'50000',
            'goalProgress': '20',
            'goalName': '',
            'goalSlider': '50'
        };
        const response = await request(baseURL).post("/TroveAccounting/add").send(form);
        cookie = response.headers['set-cookie'];
        expect(response['text']).toContain('Found.')

    });
});
describe("Testing the code redirects you to login upon no user id", () => {
    test("It should respond by redirect", async () => {
        const form = {
            'uid':''
        };
        const response = await request(baseURL).post("/TroveAccounting/add").send(form);
        expect(response['text']).toContain('Found.')

    });
});