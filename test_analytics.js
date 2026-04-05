const db = require('./backend/src/config/db');
const analyticsService = require('./backend/src/services/analyticsService');

async function test() {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log("Testing with date:", today);
    const data = await analyticsService.getDashboardData(today, today);
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
