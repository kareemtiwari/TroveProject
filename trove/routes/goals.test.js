const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("Testing the add goal info", () => {
    test("It should respond by redirect", async () => {
        const form = {
            'goalID': 'option1',
            'goalAmount':'2000',
            'goalProgress': '20',
            'goalName': 'New car',
            'goalSlider': '50'
        };
        const response = await request(baseURL).post("/TroveAccounting/").send(form);
            expect(response.statusCode).toBe(302);

    });
});