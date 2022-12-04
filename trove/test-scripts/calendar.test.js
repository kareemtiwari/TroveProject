const request = require("supertest");
const baseURL = "http://localhost:3000";

/**
1. Null Name
    - Event Name: “”
	- Day: Sunday
    - Start Time: 12:00am
    - End Time: 12:30am
    - Select Job: Salary Job
 -> ERROR: “Event must be named.”
 */
describe("Test Calendar: Add an Event with no name", () => {
    test("Should reload page with error message displayed to user.", async () => {
        const form = {
            'type': 'addEvent',
            'eName': '',
            'eDay': '0',
            'eStart': '0.0',
            'eEnd': '0.5',
            'jobSelector': '1'
        };
        const response = await request(baseURL).post('/Weekly-Calendar').send(form);
        expect(response.statusCode).toBe(302);
    });
});

/**
2. Start Time After End Time
    - Event Name: “Name”
	- Day: Sunday
    - Start Time: 12:30am
    - End Time: 12:00am
    - Select Job: Salary Job
 -> ERROR: “Event end time must be after the start time.”
 */
describe("Test Calendar: Add an Event with the Start Time after the End Time", () => {
    test("Should reload page with error message displayed to user.", async () => {
        const form = {
            'type': 'addEvent',
            'eName': 'Event Name',
            'eDay': '0',
            'eStart': '0.5',
            'eEnd': '0.0',
            'jobSelector': '1'
        };
        const response = await request(baseURL).post('/Weekly-Calendar').send(form);
        expect(response.statusCode).toBe(302);
    });
});

/**
3. Start Time Equals End Time
    - Event Name: “Name”
	- Day: Sunday
    - Start Time: 12:00am
    - End Time: 12:00am
    - Select Job: Salary Job
 -> ERROR: “Event end time must be after the start time.”
 */
describe("Test Calendar: Add an Event where the Start Time and End Time are the same", () => {
    test("Should reload page with error message displayed to user.", async () => {
        const form = {
            'type': 'addEvent',
            'eName': 'Event Name',
            'eDay': '0',
            'eStart': '0.0',
            'eEnd': '0.0',
            'jobSelector': '1'
        };
        const response = await request(baseURL).post('/Weekly-Calendar').send(form);
        expect(response.statusCode).toBe(302);
    });
});

/**
4. Successfully Add an Event
    - Event Name: “Name”
	- Day: Sunday
    - Start Time: 9:00am
    - End Time: 5:00pm
    - Select Job: Salary Job
 -> SUCCESS: Event added to events DB, Event displayed on the calendar
 */
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

/**
 5. Successfully Delete an Event
    - Select an Event to Delete: Name on Sunday for Salary Job
 -> SUCCESS: Event deleted from events DB, Event removed from calendar display
 */
describe("Test Calendar: Delete an Event from the Calendar", () => {
    test("Should reload the page after deleting the Event from the db.", async () => {
        const form = {
            'type': 'deleteEvent',
            'eventSelector': '1'
        };
        const response = await request(baseURL).post('/Weekly-Calendar').send(form);
        expect(response.statusCode).toBe(302);
    });
});

/**
 6. Click “Delete All Events” Button
 -> Display ‘Are you sure you want to delete all events?’ warning, Confirm Deletion button, and Cancel button
 */
describe("Test Calendar: Test 'Delete All' button", () => {
    test("Should reload the page displaying the 'Confirm Delete All' section.", async () => {
        const form = {
            'type': 'deleteAll',
        };
        const response = await request(baseURL).post('/Weekly-Calendar').send(form);
        expect(response.statusCode).toBe(302);
    });
});

/**
 7. Click “Confirm Deletion” Button
 -> SUCCESS: All user events are deleted from the events DB, calendar is displayed without any events,
 delete event section is not displayed on page
 */
describe("Test Calendar: Test 'Confirm Delete All' button", () => {
    test("Should reload the page after deleting all user Events from the db.", async () => {
        const form = {
            'type': 'confirmDeleteAll',
        };
        const response = await request(baseURL).post('/Weekly-Calendar').send(form);
        expect(response.statusCode).toBe(302);
    });
});

/**
 8. Click “Cancel” Button in 'Delete All' Section
 -> SUCCESS: Reload to the default page display
 */
describe("Test Calendar: Test 'Cancel' button", () => {
    test("Should reload the page to the default display.", async () => {
        const form = {
            'type': 'cancelDeleteAll',
        };
        const response = await request(baseURL).post('/Weekly-Calendar').send(form);
        expect(response.statusCode).toBe(302);
    });
});

/**
 9. Pass SQL as Event Name
    - Event Name: “Drop Table Events;”
    - Day: Sunday
    - Start Time: 12:00am
    - End Time: 12:30pm
    - Select Job: Salary Job
 -> SUCCESS: Event added to events DB, Event displayed on the calendar. SQL is treated as a string
 representing the event’s name
 */
describe("Test Calendar: Add an Event with SQL injection in the Event Name", () => {
    test("Should add the Event to db.", async () => {
        const form = {
            'type': 'addEvent',
            'eName': 'Drop Table Events;',
            'eDay': '0',
            'eStart': '0.0',
            'eEnd': '0.5',
            'jobSelector': '1'
        };
        const response = await request(baseURL).post('/Weekly-Calendar').send(form);
        expect(response.statusCode).toBe(302);
    });
});