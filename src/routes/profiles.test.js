const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Testing for the user's profile on a separate in-memory server", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
    } catch (err) {
      console.error(err);
    }
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("[POST] create a profile for an existing user", () => {
    xit("Should add a profile for the user", async () => {
      const newProfile = {
        username: "user123"
      };
      const { body: profile } = await request(app)
        .post("/profiles/new")
        .send(newProfile)
        .expect(200);

      expect(profile.username).toBe("user123");
    });
  });
  
  describe("[PUT] update a profile for an existing user", () => {
    xit("Should update the profile for the user", async () => {
      const updatedProfile = {
        username: "user124",
        birthYear: 1991,
        retirementAge: 60,
        passingAge: 80,
        retirementIncome: 1000,
        interestRate: 5
      };
      const { body: profile } = await request(app)
        .put("/profiles/user124")
        .send(updatedProfile)
        .expect(200);

      expect(() => expect.objecContaining(profile));
    });
  });
});
