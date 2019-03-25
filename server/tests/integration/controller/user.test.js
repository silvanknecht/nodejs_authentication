const request = require("supertest");
const User = require("../../../models/user");
let server;

beforeEach(() => {
  server = require("../../../app");
});
afterEach(async () => {
  await server.close();
  await User.deleteMany({});
});

const mockUser = new User({
  methode: "local",
  local: {
    email: "test.test@test.test",
    password: "test"
  }
});

describe("signUp", () => {
  let payload;
  const exec = () => {
    return request(server)
      .post("/api/v1/users/signUp")
      .send(payload);
  };

  beforeEach(() => {
    payload = { email: "test.test@test.test", password: "test" };
  });

  it("should return 400 if the input email was invalid", async () => {
    payload.email = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 400 if the input password was invalid", async () => {
    payload.password = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 409 if the email is already in use", async () => {
    await mockUser.save();

    const res = await exec();

    expect(res.status).toBe(409);
  });

  it("should return 200 and jwt token if valid input was provided", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
  });
});


describe("signIn", () => {
    let payload;
    const exec = () => {
      return request(server)
        .post("/api/v1/users/signUp")
        .send(payload);
    };

    beforeEach(() => {
      payload = { email: "test.test@test.test", password: "test" };
    });

    it("should return 400 if the input email was invalid", async () => {
      payload.email = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

});