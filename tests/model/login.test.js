const model = require('../../lib/model/login');
const getConnection = require('../../lib/schema');

let connection = null;

beforeAll(async () => {
  connection = await getConnection();
});

afterAll(async () => {
  connection.disconnect();
});

describe("Login model", () => {
  describe("Create", () => {
    it ("Should reject invalid parameters user", async () => {
      const invalidEmailResult = await model.create(null, "123123", connection);
      expect(invalidEmailResult.error).toBeDefined();
  
      const invalidPasswordResult = await model.create("test@test.com", null, connection);
      expect(invalidPasswordResult.error).toBeDefined();
    });
  
    it ("Should reject unmatch user password and email", async () => {
      const result = await model.create('test@test.com', 'test321', connection);
      expect(result.error).toBeDefined();
    });
  
    it ("Should return a token", async () => {
      const result = await model.create('test@test.com', 'test123', connection);
      expect(result.data).toBeDefined();
    });
  });

  describe("Verifiy", () => {
    it ("Should reject an invalid token", async () => {
      const result = await model.verifiy("test", connection);
      expect(result.code).toBeFalsy();
    });

    it ("Should accept an valid token", async () => {
      const loginResult = await model.create('test@test.com', 'test123', connection);
      const result = await model.verifiy(loginResult.data, connection);
      expect(result.data).toBeTruthy();
    });
  });
});
