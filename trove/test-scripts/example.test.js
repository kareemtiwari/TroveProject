const request = require("supertest");
const app = require("../app");
const baseURL = "https://localhost:3000";

describe("Test the root path", () => {
    test("It should response the GET method", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(302);
    });
});

describe("Test the login path", () => {
    test("It should response the GET method", async () => {
        const response = await request(app).get("/Trove_Login");
        expect(response.statusCode).toBe(200);
    });
});

describe("Test basic math", () => {
    test("It should be 200", async () => {
        const response = 100+100;
        expect(response).toBe(200);
    });
});

describe("Test the login correct info", () => {
    test("It should respond by redirect", async () => {
        const response = await request(app).post("/Trove_Login")
            .set({
                'Content-Type': 'application/json',
            }).field('UsName', 'johndoe')
            .field('Psswd', 'lolcleartext');
            expect(response.statusCode).toBe(200);
    });
});

describe("POST /todo", () => {
    it("should add an item to todos array", async () => {
        const response = await request(baseURL).post("/Trove_Login").field('UsName', 'johndoe')
            .field('Psswd', 'lolcleartext');
        expect(response.statusCode).toBe(200);
    });
});
t
describe("Test the login with bad username value",()=>{
    test("It should respond by redirect", async () => {
        const response = await request(app).post("/Trove_Login")
            .set({
                'Content-Type':'application/json',
            }).field('UsName','12346584')
            .field('Psswd','lolcleartext');
            expect(response.statusCode).toBe(200);

    });

    describe("POST /todo", () => {
        it("should add an item to todos array", async () => {
            const response = await request(baseURL).post("/Trove_Login").field('UsName', 'johndoe')
                .field('Psswd', 'lolcleartext');
            expect(response.statusCode).toBe(200);
        });
    });

    describe("Test the login with bad username value",()=>{
        test("It should respond by redirect", async () => {
            const response = await request(app).post("/Trove_Login")
                .set({
                    'Content-Type':'application/json',
                }).field('UsName','12346584')
                .field('Psswd','lolcleartext');
            expect(response.statusCode).toBe(200);

        });
});