const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-aw3some';
exports.APP_SECRET = APP_SECRET;

exports.getUserId = function getUserId(context) {
  const Authorization = context.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error('Not authenticated');
};

/**
 * Used to simulate a slow server response.
 * @return {Promise<boolean>}
 */
exports.waitABit = async function waitABit() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
};
