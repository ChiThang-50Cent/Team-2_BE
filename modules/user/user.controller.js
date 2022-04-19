const bcrypt = require("bcrypt");

const { User, validateLogin } = require("./user.model");

const login = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error)
    return res
      .status(400)
      .send({ isError: true, message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({
      isError: true,
      message: "Invalid email or password",
    });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({
      isError: true,
      message: "Invalid email or password",
    });

  const token = user.generateAuthToken();

  return res
    .header("x-auth-token", token)
    .status(200)
    .send({ isError: false, message: "Login successfully" });
};

module.exports = { login };
