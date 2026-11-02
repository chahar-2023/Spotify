const app = require('../Backend/src/app'); // Apne folder structure ke hisaab se path check kar lein

module.exports = (req, res) => {
  return app(req, res);
};