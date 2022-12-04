const request = require("supertest");
const baseURL = "http://localhost:3000";

let cookie;

describe("Make sure the page cannot be accessed without logging in", () => {
    test("It should send an error back", async () => {
        let fuzz = makeid(5000);
        const form ={
            "fname":"jon",
            "lname":"doe",
            "dob":"11-04-2000",
            "jpay":"60",
            "mode":"salary",
            "jName":"poo",
            "expSize":0,
            "formID":"ACC"
        };
        const response = await request(baseURL).post("/accSettings").send(form);
        expect(response["text"]).toContain("Found. Redirecting to /Trove_Login");
    });
});

describe("Test Login", () => {
    test("Make sure that logging in with unfinished account goes to accSettings", async () => {
        const form ={
            "UsName":"johndoe@gmail.com",
            "Psswd":"test"
        };
        const response = await request(baseURL).post("/Trove_Login")
            .send(form);
        cookie = response.headers['set-cookie'];
        expect(response["text"]).toContain("Found. Redirecting to /");
    });
});

describe("Test Correct updating acc", () => {
    test("Should redirect to dashboard", async () => {
        let fuzz = makeid(50);
        const form ={
            "fname":"john",
            "lname":"doe",
            "dob":"11-04-2000",
            "jpay":"60",
            "mode":"salary",
            "jName":"poo",
            "expSize":0,
            "formID":"ACC"
        };
        const response = await request(baseURL).post("/accSettings").set('Cookie',cookie)
            .send(form);
        expect(response["text"]).toContain("Found. Redirecting to /Dashboard");
    });
});

describe("Fuzz Firstname", () => {
    test("Send garbage to Firstname", async () => {
        let fuzz = makeid(5000);
        const form ={
            "fname":fuzz,
            "lname":"doe",
            "dob":"11-04-2000",
            "jpay":"60",
            "mode":"salary",
            "jName":"poo",
            "expSize":0,
            "formID":"ACC"
        };
        const response = await request(baseURL).post("/accSettings").set('Cookie',cookie)
            .send(form);
        expect(response["text"]).toContain("First Name is wrong");
    });
});

describe("Fuzz Lastname", () => {
    test("Send garbage to Lastname", async () => {
        let fuzz = makeid(5000);
        const form ={
            "fname":"jon",
            "lname":fuzz,
            "dob":"11-04-2000",
            "jpay":"60",
            "mode":"salary",
            "jName":"poo",
            "expSize":0,
            "formID":"ACC"
        };
        const response = await request(baseURL).post("/accSettings").set('Cookie',cookie)
            .send(form);
        expect(response["text"]).toContain("Last Name is wrong");
    });
});

describe("Send an empty Date", () => {
    test("It should send an error back", async () => {
        let fuzz = makeid(5000);
        const form ={
            "fname":"jon",
            "lname":"doe",
            "dob":"",
            "jpay":"60",
            "mode":"salary",
            "jName":"poo",
            "expSize":0,
            "formID":"ACC"
        };
        const response = await request(baseURL).post("/accSettings").set('Cookie',cookie)
            .send(form);
        expect(response["text"]).toContain("Date is Empty");
    });
});

describe("Send all empty", () => {
    test("It should send an error back", async () => {
        let fuzz = makeid(5000);
        const form ={
            "fname":"",
            "lname":"",
            "dob":"",
            "jpay":"",
            "mode":"",
            "jName":"",
            "expSize":0,
            "formID":"ACC"
        };
        const response = await request(baseURL).post("/accSettings").set('Cookie',cookie)
            .send(form);
        expect(response["text"]).toContain("You Have to fill out Everything");
    });
});

describe("Send all spaces", () => {
    test("It should send an error back", async () => {
        let fuzz = makeid(5000);
        const form ={
            "fname":" ",
            "lname":" ",
            "dob":" ",
            "jpay":" ",
            "mode":" ",
            "jName":" ",
            "expSize":0,
            "formID":"ACC"
        };
        const response = await request(baseURL).post("/accSettings").set('Cookie',cookie)
            .send(form);
        expect(response["text"]).toContain("You Have to fill out Everything");
    });
});

//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript [csharptest.net]
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


