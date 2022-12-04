const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("Test Sign-Up: leave all of the form fields empty", () => {
    test("Should dsiplay an error message to the user.", async () => {
        const form = {
            "Fname":" ",
            "Lname":" ",
            "Email":" ",
            "NewPsswd":" ",
            "CheckPsswd":" ",
        };
        const response = await request(baseURL).post('/Sign_Up').send(form);
        expect(response['text']).toContain('You have to fill out all forms, Nothing must be left empty')
    });
});

describe("Test Sign-Up: leave the First name val form field empty", () => {
    test("Should dsiplay an error message to the user.", async () => {
        const form = {
            "Fname":" ",
            "Lname":"Manny",
            "Email":"WeCanFixIt@gmail.com",
            "NewPsswd":"CanWeFixitYesWeCan",
            "CheckPsswd":"CanWeFixitYesWeCan",
        };
        const response = await request(baseURL).post('/Sign_Up').send(form);
        expect(response['text']).toContain('You have to fill out The First Name field')
    });

});

describe("Test Sign-Up: leave the Last name val form field empty", () => {
    test("Should display an error message to the user.", async () => {
        const form = {
            "Fname": "Handy",
            "Lname": "",
            "Email": "WeCanFixIt@gmail.com",
            "NewPsswd": "CanWeFixitYesWeCan",
            "CheckPsswd": "CanWeFixitYesWeCan",
        };
        const response = await request(baseURL).post('/Sign_Up').send(form);
        expect(response['text']).toContain('You have to fill out The Last Name field')

    });

});

describe("Test Sign-Up: leave the Email val form field empty", () => {
    test("Should dsiplay an error message to the user.", async () => {
        const form = {
            "Fname": "Handy",
            "Lname": "Manny",
            "Email": "",
            "NewPsswd": "CanWeFixitYesWeCan",
            "CheckPsswd": "CanWeFixitYesWeCan",
        };
        const response = await request(baseURL).post('/Sign_Up').send(form);
        expect(response['text']).toContain('You have to fill out The Email field')

    });

});

describe("Test Sign-Up: leave the NewPsswd val form field empty", () => {
    test("Should dsiplay an error message to the user.", async () => {
        const form = {
            "Fname": "Handy",
            "Lname": "Manny",
            "Email": "WeCanFixIt@gmail.com",
            "NewPsswd": "",
            "CheckPsswd": "CanWeFixitYesWeCan",
        };
        const response = await request(baseURL).post('/Sign_Up').send(form);
        expect(response['text']).toContain('The New password value is too short. Needs to be a minimum of 12 characters.')

    });

});

describe("Test Sign-Up: leave the CheckPsswd val form field empty", () => {
    test("Should display an error message to the user.", async () => {
        const form = {
            "Fname": "Handy",
            "Lname": "Manny",
            "Email": "WeCanFixIt@gmail.com",
            "NewPsswd": "CanWeFixitYesWeCan",
            "CheckPsswd": "",
        };
        const response = await request(baseURL).post('/Sign_Up').send(form);
        expect(response['text']).toContain("The Check password value cannot remain empty.Please enter the value that matches the password created above.")

    });

});

describe("Test Sign-Up: Check if the CheckPsswd val form field matches the New Password form field", () => {
    test("Should dsiplay an error message to the user.", async () => {
        const form = {
            "Fname": "Handy",
            "Lname": "Manny",
            "Email": "WeCanFixIt@gmail.com",
            "NewPsswd": "CanWeFixitYesWeCan",
            "CheckPsswd": "NoWeCannotFixThatShit",
        };
        const response = await request(baseURL).post('/Sign_Up').send(form);
        expect(response['text']).toContain("The Check password value need to match the New password value above")

    });

});


