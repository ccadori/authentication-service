const validator = require('validator');

const getConnection = require('../schema/index');
const encrypt = require('../utilities/password').encrypt;

class User {
  static async create (username, email, password, customFields) {
    if (!validator.isAlphanumeric(username))
      return { error: { message: "Invalid username." } };
      
    if (username.length < 6 || username.length > 255)
      return { error: { message: "Invalid username length." } };

    if (!validator.isEmail(email))
      return { error: { message: "Invalid email." } };

    if (password.length < 6 || password.length > 255)
      return { error: { message: "Invalid password length." } };

    for (let field of customFields) {
      if (!validator.isAlpha(field.name))
        return { error: { message: "Invalid custom field name." } };

      if (field.val > 255)
        return { error: { message: "Invalid custom field value." } };

      if (Object.keys(field).length != 2)
        return { error: { message: "Invalid custom field number of keys." } };
    }

    const sameEmailUser = await User.findByEmail(email);
    
    if (sameEmailUser.data)
      return { error: { message: "Email already in use." } };

    password = await encrypt(password);
    const connection = await getConnection();
    const Model = connection.model('users');
    
    const newUser = new Model({ username, password, customFields, email });
    await newUser.save();

    return { data: newUser };
  }

  static async findByEmail (email) {
    if (!validator.isEmail(email))
      return { error: { message: "Invalid email." } };
    
    const connection = await getConnection();
    const found = await connection.model('users').findOne({ email: email });

    return { data: found };
  }
}

module.exports = User;
