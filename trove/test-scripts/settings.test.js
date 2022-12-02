const request = require("supertest");
const app = require("../app");
const baseURL = "https://localhost:3000/";


describe("Test basic math", () => {
    test("It should be 200", async () => {
        const response = 100+100;
        expect(response).toBe(200);
    });
});