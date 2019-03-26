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

describe("signUp", () => {
  let payload;
  const exec = () => {
    return request(server)
      .post("/api/v1/users/signUp")
      .send(payload);
  };

  const mockUser = new User({
    methode: "local",
    local: {
      email: "test.test@test.test",
      password: "test"
    }
  });

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
  it("should save the user in the database", async () => {
    const res = await exec();
    const result = await User.findOne({ "local.email": payload.email });

    expect(res.status).toBe(200);
    expect(result.local.email).toBe(payload.email);
  });

  it("should return 409 if the email is already in use", async () => {
    await mockUser.save();

    const res = await exec();

    expect(res.status).toBe(409);
  });

  it("should return 200 and jwt token if valid input was provided", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.body.token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
  });
});

describe("signIn", () => {
  let payload;

  const exec = () => {
    return request(server)
      .post("/api/v1/users/signIn")
      .send(payload);
  };

  const mockUser = new User({
    methode: "local",
    local: {
      email: "test.test@test.test",
      password: "test"
    }
  });

  beforeEach(async () => {
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

  it("should return 200 and a valid jwt when valid input was provided", async () => {
    await mockUser.save();

    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.body.token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
  });
});




