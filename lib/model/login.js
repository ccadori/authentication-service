const passwordUtility = require('../utilities/password');
const tokenUtility = require('../utilities/token');
const userModel = require('./user');

class Login {
  static async create(email, password, connection) {
    if (!email || !password)
      return { error: { code: 400, message: "Invalid parameters" } };

    const foundUserResult = await userModel.findByEmail(email, connection);

    if (foundUserResult.error)
      return foundUserResult;

    if (!foundUserResult.data)
      return { error: { code: 400, message: "Invalid credentials." } };

    const checkedPassword = await passwordUtility.check(password, foundUserResult.data.password);

    if (!checkedPassword)
      return { error: { code: 400, message: "Invalid credentials." } }

    const payload = {
      email: foundUserResult.data.email,
      id: foundUserResult.data._id,
    };

    const token = await tokenUtility.create(payload);

    return { data: token }
  }

  static async logout(token, connection) {
    if (!token)
      return { error: { code: 400, message: "Invalid token" } };

    const verifyResult = await Login.verifiy(token, connection);

    if (!verifyResult.error)
      return verifyResult;

    const foundToken = await Login.findBlockedToken(token, connection);

    if (foundToken.data)
      return { error: { code: 400, message: "Token already blocked" } };

    const Model = connection.model('blockeds');
    const newBlocked = new Model({ token });
    await newBlocked.save();

    return { data: newBlocked };
  }

  static async findBlockedToken(token, connection) {
    if (!token)
      return { error: { code: 400, message: "Invalid token" } };

    const found = await connection.model('blockeds').findOne({ token: token });
    return { data: found };
  }

  static async verifiy(token, connection) {
    if (!token)
      return { error: { code: 400, message: "Invalid token" } };

    if (!(await tokenUtility.verify(token)))
      return { data: false };

    const foundBlocked = await Login.findBlockedToken(token, connection);

    if (foundBlocked.error)
      return foundBlocked.error;

    if (foundBlocked.data)
      return { error: { code: 400, message: "Token is blocked" } };

    return { data: true };
  }
};

module.exports = Login;
