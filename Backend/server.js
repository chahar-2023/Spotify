require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');


connectDB()

app.get('/', (req, res) => {
  res.send('Spotify API backend is running!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})