const request = require("supertest");

const User = require("../../../models/user");
const { thirdPartyOAuth } = require("../../../controllers/users");

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
    const mockUser = new User({
      methode: "local",
      local: {
        email: "test.test@test.test",
        password: "test"
      }
    });
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
    const mockUser = new User({
      methode: "local",
      local: {
        email: "test.test@test.test",
        password: "test"
      }
    });
    await mockUser.save();

    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.body.token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
  });
});

describe("me", () => {
  let token;
  const exec = () => {
    return request(server)
      .get("/api/v1/users/me")
      .set("Authorization", token);
  };
  it("should return 401 if input token is invalid", async () => {
    token = "0";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 200 and the user object if input token is valid", async () => {
    const mockUser = new User({
      methode: "local",
      local: {
        email: "test.test@test.test",
        password: "test"
      }
    });
    await mockUser.save();
    token = "bearer " + mockUser.generateAuthToken();

    const res = await exec();

    expect(res.body).toHaveProperty("_id");
  });
});
