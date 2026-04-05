const app = require('./app');
const db = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // 1. Establish Database Connection Pool Initializer Check
    await db.testConnection();

    // 2. Start Express Server
    app.listen(PORT, () => {
      console.log(`🚀 Jor Shor POS Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('Failed to initialize application startup.', error);
    process.exit(1);
  }
};

startServer();
