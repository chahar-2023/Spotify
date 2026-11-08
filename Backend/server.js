require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

app.get('/', (req, res) => {
  res.send('Spotify API backend is running!');
});

// For Vercel: wait for the DB connection before every request
module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({ message: 'Database connection failed' });
  }
  return app(req, res);
};

// For local: runs only when you start the file directly with `node server.js`
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(3000, () => {
        console.log('Server is running on port 3000');
      });
    })
    .catch((err) => {
      console.log('Server start failed', err);
    });
}