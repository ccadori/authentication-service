const passwordUtility = require('../utilities/password');
const tokenUtility = require('../utilities/token');
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
};

module.exports = Login;
