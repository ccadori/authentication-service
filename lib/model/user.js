const validator = require('validator');

const getConnection = require('../schema/index');
const encrypt = require('../utilities/password').encrypt;

const User = {
  create: async (username, email, password, customFields) => {
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

    password = await encrypt(password);
    const connection = await getConnection();
    const Model = connection.model('users');
    
    const newUser = new Model({ username, password, customFields, email });
    await newUser.save();

    return { data: newUser };
  }
}

module.exports = User;
