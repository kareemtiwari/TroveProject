const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("Test Sign-Up: leave all of the form fields empty", () => {
    test("Should dsiplay an error message to the user.", async () => {
        const form = {
            "FName":" ",
            "LName":" ",
            "Email":" ",
            "NewPsswd":" ",
            "CheckPsswd":" ",
        };
        const response = await request(baseURL).post('/Sign-Up').send(form);
        expect.toContain('You have to fill out all forms, Nothing must be left empty')
    });
});

describe("Test Sign-Up: leave the First name val form field empty", () => {
    test("Should dsiplay an error message to the user.", async () => {
        const form = {
            "FName":" ",
            "LName":"Manny",
            "Email":"WeCanFixIt@gmail.com",
            "NewPsswd":"CanWeFixitYesWeCan",
            "CheckPsswd":"CanWeFixitYesWeCan",
        };
        const response = await request(baseURL).post('/Sign-Up').send(form);
        expect.toContain('You have to fill out The First Name field')
    });

});

describe("Test Sign-Up: leave the Last name val form field empty", () => {
    test("Should dsiplay an error message to the user.", async () => {
        const form = {
            "FName": "Handy",
            "LName": "",
            "Email": "WeCanFixIt@gmail.com",
            "NewPsswd": "CanWeFixitYesWeCan",
            "CheckPsswd": "CanWeFixitYesWeCan",
        };
        const response = await request(baseURL).post('/Sign-Up').send(form);
        expect.toContain('You have to fill out The Last Name field')

    });

});

describe("Test Sign-Up: leave the Email val form field empty", () => {
    test("Should dsiplay an error message to the user.", async () => {
        const form = {
            "FName": "Handy",
            "LName": "Manny",
            "Email": "",
            "NewPsswd": "CanWeFixitYesWeCan",
            "CheckPsswd": "CanWeFixitYesWeCan",
        };
        const response = await request(baseURL).post('/Sign-Up').send(form);
        expect.toContain('You have to fill out The Email field')

    });

});

describe("Test Sign-Up: leave the NewPsswd val form field empty", () => {
    test("Should dsiplay an error message to the user.", async () => {
        const form = {
            "FName": "Handy",
            "LName": "Manny",
            "Email": "WeCanFixIt@gmail.com",
            "NewPsswd": "",
            "CheckPsswd": "CanWeFixitYesWeCan",
        };
        const response = await request(baseURL).post('/Sign-Up').send(form);
        expect.toContain('You have to fill out The New Password field')

    });

});

describe("Test Sign-Up: leave the CheckPsswd val form field empty", () => {
    test("Should dsiplay an error message to the user.", async () => {
        const form = {
            "FName": "Handy",
            "LName": "Manny",
            "Email": "WeCanFixIt@gmail.com",
            "NewPsswd": "CanWeFixitYesWeCan",
            "CheckPsswd": "",
        };
        const response = await request(baseURL).post('/Sign-Up').send(form);
        expect.toContain()

    });

});


