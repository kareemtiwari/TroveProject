const request = require("supertest"); //TODO: Import supertest - jest does not have to be included
const baseURL = "http://localhost:3000";    //TODO: copy this line exactly it is the server's URL

//TODO : The format for writing tests
describe("Test the root path", () => {  //TODO : The string just says what your test does
    test("It should response the GET method", async () => {     //TODO : The string says the expected behavior of the system given input
        const response = await request(baseURL).get("/");   //TODO : Use supertest to interact with the server
        expect(response.statusCode).toBe(302);  //TODO : check if it did what you expected
    });
});

describe("Test the login path", () => {
    test("It should response the GET method", async () => {
        const response = await request(baseURL).get("/Trove_Login");
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
    test("It should respond by redirect", async () => { //TODO : How to test by sending form data
        const form ={
          "UsName":"johndoe@gmail.com",
          "Psswd":"lolcleartext"
        };
        const response = await request(baseURL).post("/Trove_Login")
            .send(form);
            expect(response.statusCode).toBe(302);
    });
});

