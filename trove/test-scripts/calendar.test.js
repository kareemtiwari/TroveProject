const request = require("supertest");
const app = require("../app");
const baseURL = "https://localhost:3000/";


describe("Test Calendar: Add Successful Event", () => {
    test("Should add event to db.", async () => {
        const form = {
            'type': 'addEvent',
            'eName': 'Event Name',
            'eDay': '1',
            'eStart': '9.0',
            'eEnd': '17.0',
            'jobSelector': '1'
        };
        const response = await request(baseURL).post('/Weekly-Calendar').send(form);
            expect(response.statusCode).toBe(302);
    });
});

describe("Test the login correct info", () => {
    test("It should respond by redirect", async () => {
        const form = {
            "UsName": "johndoe@gmail.com",
            "Psswd": "lolcleartext"
        };
        const response = await request(baseURL).post("/Trove_Login").send(form);
            expect(response.statusCode).toBe(302); //redirect?
    });
});