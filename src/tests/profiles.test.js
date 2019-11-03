const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Profile = require("../models/Profile");
const { mockProfiles } = require("./mockData");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

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

  beforeEach(async () => {
    await Profile.create(mockProfiles);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Profile.deleteMany();
  });

  describe("[GET] get all profiles", () => {
    it("should return all the profiles in the collection", async () => {
      const response = await request(app).get("/profiles/");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it("should return the specified profile in the collection", async () => {
      jwt.verify.mockReturnValueOnce({});
      const response = await request(app)
        .get("/profiles/user123")
        .set("Cookie", "token=valid-token");

      expect(response.status).toBe(200);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].birthYear).toBe(1991);
      expect(response.body[0].retirementAge).toBe(65);
      expect(response.body[0].passingAge).toBe(85);
      expect(response.body[0].retirementIncome).toBe(1500);
      expect(response.body[0].interestRate).toBe(6);
    });

    it("should not return the specified profile in the collection if user is not logged in", async () => {
      const response = await request(app).get("/profiles/user123");

      expect(response.status).toBe(401);
      expect(response.text).toBe("You are not authorized");
    });
  });

  describe("[POST] create a profile for an existing user", () => {
    it("Should add a profile for the user", async () => {
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
    it("Should update the profile for the user", async () => {
      jwt.verify.mockReturnValueOnce({});
      const updatedProfile = {
        username: "user124",
        birthYear: 1991,
        retirementAge: 60,
        passingAge: 80,
        retirementIncome: 1000,
        interestRate: 5
      };
      const response = await request(app)
        .put("/profiles/user124")
        .set("Cookie", "token=valid-token")
        .send(updatedProfile);

      expect(response.status).toBe(200);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(() => expect.objecContaining(updatedProfile));
    });
  });
});
