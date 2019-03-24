const config = require("config");
const jwt = require("jsonwebtoken");

const { User } = require("../../../models/user");

describe("User model", () => {
  it("should return a valid authentication token", () => {
    const token = new User().generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    expect(decoded.sub).toHaveProperty("_id");
  });
});
