const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/User");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mockUsers = require("./mockData");
// const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("Testing for the users on a separate in-memory server", () => {
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
    await User.create(mockUsers);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await User.deleteMany();
  });

  describe("[POST] add a new user", () => {
    it("Should add a new user", async () => {
      const newUser = {
        firstName: "Harry",
        lastName: "Truman",
        username: "user126",
        password: "password1234"
      };
      const { body: user } = await request(app)
        .post("/users/new")
        .send(newUser)
        .expect(200);

      expect(user.firstName).toBe("Harry");
      expect(user.lastName).toBe("Truman");
      expect(user.username).toBe("user126");
      expect(user.password).not.toBe("password1234");
    });
  });

  describe("[POST] Attempt to login an existing user", () => {
    it("Should allow an existing user to login if the password is correct", async () => {
      const existingUser = {
        username: "user125",
        password: "password4321"
      };
      const response = await request(app)
        .post("/users/login")
        .send(existingUser);

      expect(response.status).toEqual(200);
      // expect(response.text).toEqual("Sucessfully logged in!");
    });

    it("Should not allow an existing user to login if the password is wrong", async () => {
      const existingUser = {
        username: "user125",
        password: "wrongpassword"
      };
      const response = await request(app)
        .post("/users/login")
        .send(existingUser);

      expect(response.status).toEqual(400);
      // expect(response.text).toBe("Wrong password!");
    });
  });

  xdescribe("[DEL] remove an existing user", () => {
    it("Should delete an existing user", async () => {
      const loggedInUser = {
        username: "user125",
        password: "password4321"
      };

      await request(app)
        .post("/users/login")
        .send(loggedInUser);

      const response = await request(app).delete("/users/");

      expect(response.status).toEqual(200);
      expect(response.text).toEqual("Successfully deleted user");
    });
  });
});
