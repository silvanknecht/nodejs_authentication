const router = require("express-promise-router")();
const passport = require("passport");
require("../passport");

// validation
const { validateBody, schemas } = require("../helpers/routeHelpers");

// controller
const UsersController = require("../controllers/users");

// passport strategies
const passportSignIn = passport.authenticate("local", {
  session: false
});
const passportJWT = passport.authenticate("jwt", {
  session: false
});
const passportGoogle = passport.authenticate("googleToken", {
  session: false
});
const passportFacebook = passport.authenticate("facebookToken", {
  session: false
});
const passportGithub = passport.authenticate("githubToken", {
  session: false
});

// if the validation fails the controller doesn't get called
router.post(
  "/signup",
  validateBody(schemas.authSchemaLocal),
  UsersController.signUp
);
router.post(
  "/signin",
  validateBody(schemas.authSchemaLocal),
  passportSignIn,
  UsersController.signIn
);
router.post("/oauth/google", passportGoogle, UsersController.googleOAuth);
router.post("/oauth/facebook", passportFacebook, UsersController.facebookOAuth);
router.post("/oauth/github", passportGithub, UsersController.githubOAuth);
router.get("/secret", passportJWT, UsersController.secret);

module.exports = router;
