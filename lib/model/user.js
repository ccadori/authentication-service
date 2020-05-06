const validator = require('validator');
const encrypt = require('../utilities/password').encrypt;

class User {
  static async create (username, email, password, customFields, connection) {
    if (!validator.isAlphanumeric(username))
      return { error: { code: 400, message: "Invalid username." } };
      
    if (username.length < 6 || username.length > 255)
      return { error: { code: 400, message: "Invalid username length." } };

    if (!validator.isEmail(email))
      return { error: { code: 400, message: "Invalid email." } };

    if (password.length < 6 || password.length > 255)
      return { error: { code: 400, message: "Invalid password length." } };

    for (let field of customFields) {
      if (!validator.isAlpha(field.name))
        return { error: { code: 400, message: "Invalid custom field name." } };

      if (field.val > 255)
        return { error: { code: 400, message: "Invalid custom field value." } };

      if (Object.keys(field).length != 2)
        return { error: { code: 400, message: "Invalid custom field number of keys." } };
    }

    const sameEmailUser = await User.findByEmail(email, connection);
    
    if (sameEmailUser.data)
      return { error: { code: 400, message: "Email already in use." } };

    password = await encrypt(password);
    const Model = connection.model('users');
    
    const newUser = new Model({ username, password, customFields, email });
    await newUser.save();

    return { data: newUser };
  }

  static async findByEmail (email, connection) {
    if (!email || !validator.isEmail(email))
      return { error: { code: 400, message: "Invalid email." } };
    
    const found = await connection.model('users').findOne({ email: email });

    return { data: found };
  }
}

module.exports = User;
