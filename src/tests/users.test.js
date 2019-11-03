const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/User");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { mockUsers } = require("./mockData");
const jwt = require("jsonwebtoken");

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

  describe("[GET] Get users", () => {
    it("should get all users", async () => {
      const response = await request(app).get("/users/");

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toEqual(true);
      expect(response.body.length).toEqual(3);
    });

    it("should get the full name of a specified user", async () => {
      const response = await request(app).get("/users/user123");

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toEqual(false);
      expect(response.body.fullName).toBe("Bob Dylan");
    });

    it("should throw an error if specified user does not exist", async () => {
      const response = await request(app).get("/users/user122");

      expect(response.status).toEqual(400);
    });
  });

  describe("[POST] add a new user", () => {
    it("Should add a new user", async () => {
      const newUser = {
        firstName: "Harry",
        lastName: "Truman",
        username: "user126",
        password: "password1234"
      };
      const response = await request(app)
        .post("/users/new")
        .send(newUser);

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toEqual(false);
      expect(response.body.firstName).toBe("Harry");
      expect(response.body.lastName).toBe("Truman");
      expect(response.body.username).toBe("user126");
      expect(response.body.password).not.toBe("password1234");
    });

    it("Should not allow existing username to be added", async () => {
      const newUser = {
        firstName: "Bob",
        lastName: "Dylan",
        username: "user123",
        password: "password4321"
      };
      const response = await request(app)
        .post("/users/new")
        .send(newUser);

      expect(response.status).toEqual(400);
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
    });

    it("[POST] Should not allow an existing user to login if the password is wrong", async () => {
      const existingUser = {
        username: "user125",
        password: "wrongpassword"
      };
      const response = await request(app)
        .post("/users/login")
        .send(existingUser);

      expect(response.status).toEqual(400);
    });

    it("[POST] Should allow the user to log out", async () => {
      const response = await request(app).post("/users/logout");

      expect(response.status).toEqual(200);
      expect(response.text).toEqual("You are now logged out!");
    });
  });

  describe("[DEL] remove an existing user", () => {
    it("Should delete an existing user if logged in with authorized token", async () => {
      jwt.verify.mockReturnValueOnce({});

      const response = await request(app)
        .delete("/users/")
        .set("Cookie", "token=valid-token");

      expect(response.status).toEqual(200);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(response.text).toEqual("Successfully deleted user");
    });

    it("Should not be able to delete an existing user if not logged in", async () => {
      const response = await request(app).delete("/users/");

      expect(response.status).toEqual(401);
      expect(response.text).toEqual("You are not authorized");
    });
  });
});
