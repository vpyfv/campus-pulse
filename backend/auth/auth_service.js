const jwt = require("jsonwebtoken");

const isUserAuthenticated = (req) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, process.env.SECRET_KEY);
    if (!claims.payload) {
      return claims;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const setJwtCookie = (user, res) => {
  const token = jwt.sign(
    { _id: user._id, name: user.name, image: user.image },
    process.env.SECRET_KEY
  );

  return res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

const restCookie = (res) => {
  res.cookie("jwt", "", { maxAge: 0 });
};

module.exports = { isUserAuthenticated, setJwtCookie, restCookie };
