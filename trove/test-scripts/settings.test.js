const request = require("supertest");
const baseURL = "http://localhost:3000";


describe("Test basic math", () => {
    test("It should be 200", async () => {
        const response = 100+100;
        expect(response).toBe(200);
    });
});

describe("", () => {
    test("It should respond by redirect", async () => { //TODO : How to test by sending form data
        const form ={
            "UsName":"johndoe@gmail.com",
            "Psswd":"lolcleartext"
        };
        const response = await request(baseURL).post("/Trove_Login").trustLocalhost(true)
            .send(form);
        expect(response.statusCode).toBe(302);
    });
});
