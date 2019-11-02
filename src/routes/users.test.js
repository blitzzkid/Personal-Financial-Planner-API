const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/User");
const { MongoMemoryServer } = require("mongodb-memory-server");
// const jwt = require("jsonwebtoken");

// jest.mock("jsonwebtoken");

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
    const user = [{ username: "testuser123", password: "password321" }];
    await User.create(user);
  });
  afterEach(async () => {
    jest.resetAllMocks();
    await User.deleteMany();
  });

  describe("[POST] add a new user", () => {
    xit("Should add a new user", async () => {
      const newUser = {
        firstName: "Bob",
        lastName: "Dylan",
        username: "user123",
        password: "password234"
      };
      const { body: user } = await request(app)
        .post("/users/new")
        .send(newUser)
        .expect(200);

      expect(user.username).toBe("user123");
      expect(user.password).not.toBe("password234");
      expect(user.firstName).toBe("Bob");
      expect(user.lastName).toBe("Dylan");
    });
  });

  // describe("[POST] Attempt to login an existing user", () => {
  //   it("Should allow an existing user to login if the password is correct", async () => {
  //     const existingUser = {
  //       username: "testuser123",
  //       password: "password321"
  //     };
  //     await request(app)
  //       .post("users/login")
  //       .send(existingUser)
  //       .expect(200);
  //   });
  
  // it("Should not allow an existing user to login if the password is wrong", async () => {
  //   const existingUser = {
  //     username: "testuser123",
  //     password: "wrongpassword"
  //   };
  //   await request(app)
  //     .post("users/login")
  //     .send(existingUser)
  //     .expect(400);
  // });
  // });

  // describe("[DEL] remove an existing user", () => {
  //   it("Should delete an existing user", async () => {
  //     await request(app)
  //       .delete("users/delete/testuser123")
  //       .expect(200)
  //       .expect("Successfully deleted user");
  //   });
  // });
});
