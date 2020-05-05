const getConnection = require('../schema/index');
const tokenUtility = require('../utilities/token');

class Blocked {
  /**
   * Adds a token the the blocked list in the database
   * @param {String} token 
   */
  static async create(token) {
    if (!token)
      return { error: { message: "Invalid token" } };

    if (!tokenUtility.verify(token))
      return { error: { message: "Invalid token" } };

    const foundToken = await Blocked.find(token);

    if (foundToken)
      return { error: { message: "Token already blocked" } };

    const connection = await getConnection();
    const Model = connection.model('blockeds');
    const newBlocked = new Model({ token });
    await newBlocked.save();

    return { data: newBlocked };
  }

  /**
   * Finds a blocked token in the database
   * @param {String} token 
   */
  static async find(token) {
    if (!token)
      return { error: { message: "Invalid token" } };
    
    const connection = await getConnection();
    const found = await connection.model('blockeds').findOne({ token: token });
    return { data: found };
  }
}

module.exports = Blocked;
