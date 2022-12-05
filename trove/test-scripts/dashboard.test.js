const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("Test the Dashboard path", () => {
    test("It should respond by redirect", async () => {
        const response = await request(baseURL).get("/Dashboard");
        expect(response.statusCode).toBe(302);
    });
});

describe("Test the accSettings path", () => {
    beforeEach( () => {})
    test("It should respond by redirect", async () => {
        const response = await request(baseURL).get("/accSettings");
        expect(response.statusCode).toBe(302);
    });
});

describe("Test the calendar path", () => {
    test("It should respond by redirect", async () => {
        const response = await request(baseURL).get("/Weekly-Calendar");
        expect(response.statusCode).toBe(302);
    });
});

describe("Test the Goals path", () => {
    test("It should respond by redirect", async () => {
        const response = await request(baseURL).get("/TroveAccounting");
        expect(response.statusCode).toBe(302);
    });
});
