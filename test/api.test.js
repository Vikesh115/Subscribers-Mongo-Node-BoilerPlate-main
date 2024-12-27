const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/app"); // Adjust path to match your project structure
require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });
  
  /* Closing database connection after each test. */
  afterEach(async () => {
    await mongoose.connection.close();
  });

describe("Subscribers API", () => {

    // Test for fetching all subscribers
    describe("GET /subscribers", () => {
        it("should fetch all subscribers", async () => {
            const res = await request(app).get("/subscribers");
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true); // Response should be an array
        });
    });

    // Test for fetching subscribers by name and subscribed channel
    describe("GET /subscribers/name", () => {
        it("should fetch subscribers by name and subscribed channel", async () => {
            jest.setTimeout(30000); // Increase timeout for database operations
            const res = await request(app).get("/subscribers/name");
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            res.body.forEach((subscriber) => {
                expect(subscriber).toHaveProperty("name");
                expect(subscriber).toHaveProperty("subscribedChannel");
            });
        });
    });

    // Test for fetching a subscriber by ID
    describe("GET /subscribers/6763f61dae32ca3ab8b4d70e", () => {

        it("should fetch a subscriber by ID", async () => {
            const res = await request(app).get(`/subscribers/6763f61dae32ca3ab8b4d70e`);
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Object);
        });
    });
});
