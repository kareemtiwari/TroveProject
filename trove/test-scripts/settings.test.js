const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("Test Login", () => {                                                                                 //TODO Im testing login to get the session cookie
    test("Make sure that logging in with unfinished account goes to accSettings", async () => {
        const form ={
            "UsName":"johndoe@gmail.com",
            "Psswd":"lolcleartext"
        };
        const response = await request(baseURL).post("/Trove_Login")
            .send(form);
        cookie = response.headers['set-cookie'];    //get the session cookie to use in the rest of my tests
        expect(response["text"]).toContain("Found.");   //essentially make sure it didn't crash
    });
});

describe("Test Correct updating acc", () => {
    test("Should redirect to dashboard", async () => {
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
        const response = await request(baseURL).post("/accSettings").set('Cookie',cookie)   //test post route with form data and session cookie
            .send(form);
        expect(response["text"]).toContain("Found.");   //look in the page html for the word "Found." - this happens in redirects [Found. Redirecting to /Dashboard]
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