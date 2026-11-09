require('dotenv').config();
const app = require('./src/app');

// सिर्फ़ लोकल के लिए: node server.js चलाने पर सर्वर शुरू होगा
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}

// Vercel इसी को इस्तेमाल करेगा
module.exports = app;