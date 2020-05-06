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
  it ("Should reject invalid parameters user", async () => {
    const invalidEmailResult = await model.create(null, "123123", connection);
    expect(invalidEmailResult.error).toBeDefined();

    const invalidPasswordResult = await model.create("test@test.com", null, connection);
    expect(invalidPasswordResult.error).toBeDefined();
  });
});
