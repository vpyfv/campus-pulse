const router = require("express").Router();
const bycrypt = require("bcryptjs");
const UserModel = require("./user_model");
const avatarGenerator = require("random-avatar-generator");

const {
  setJwtCookie,
  restCookie,
  isUserAuthenticated,
} = require("../auth/auth_service");

router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  const salt = await bycrypt.genSalt(10);
  const hashPassword = await bycrypt.hash(String(req.body.password), salt);
  const image = new avatarGenerator.AvatarGenerator().generateRandomAvatar();
  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    image: image,
  });
  const newDoc = await user.save();
  const { password, ...newUser } = newDoc._doc;
  setJwtCookie(newUser, res);
  return res.send(newUser);
});

router.post("/signin", async (req, res, next) => {
  console.log("calling signin");
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({
      message: "user not found",
    });
  }
  if (!(await bycrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({
      message: "invalid credentials",
    });
  }

  setJwtCookie(user, res);

  res.send({
    message: "logged in",
  });
});

router.get("/", async (req, res, next) => {
  try {
    const auth = isUserAuthenticated(req);
    if (auth) {
      const user = await UserModel.findOne({ _id: auth._id });
      const { password, ...data } = user.toJSON();
      return res.send(data);
    }
    return res.status(401).send({ message: "user un authenticated" });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      message: "un authenticated",
    });
  }
});

router.post("/signout", (req, res, next) => {
  console.log("signing out");
  restCookie(res);
  res.send({
    message: "success",
  });
});

module.exports = router;
