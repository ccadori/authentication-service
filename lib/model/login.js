const passwordUtility = require('../utilities/password');
const tokenUtility = require('../utilities/token');
const getConnection = require('../schema/index');
const userModel = require('./user');

class Login {
  static async create(email, password) {
    const foundUserResult = await userModel.findByEmail(email);

    if (foundUserResult.error)
      return foundUserResult;

    if (!foundUserResult.data)
      return { error: { message: "Invalid credentials." } };

    const checkedPassword = await passwordUtility.check(password, foundUserResult.data.password);
    
    if (!checkedPassword)
      return { error: { message: "Invalid credentials." } }

    const payload = {
      email: foundUserResult.data.email,
      id: foundUserResult.data._id,
    };

    const token = await tokenUtility.create(payload);

    return { data: token }
  }

  static async logout(token) {
    if (!token)
      return { error: { message: "Invalid token" } };

    if (!tokenUtility.verify(token))
      return { error: { message: "Invalid token" } };

    const foundToken = await Login.findBlockedToken(token);

    if (foundToken)
      return { error: { message: "Token already blocked" } };

    const connection = await getConnection();
    const Model = connection.model('blockeds');
    const newBlocked = new Model({ token });
    await newBlocked.save();

    return { data: newBlocked };
  }

  static async findBlockedToken(token) {
    if (!token)
      return { error: { message: "Invalid token" } };
    
    const connection = await getConnection();
    const found = await connection.model('blockeds').findOne({ token: token });
    return { data: found };
  }

  static async verifiy(token) {
    
  }
};

module.exports = Login;
