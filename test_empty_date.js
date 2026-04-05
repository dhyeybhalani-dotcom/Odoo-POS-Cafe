const db = require('./backend/src/config/db');
const analyticsService = require('./backend/src/services/analyticsService');

async function test() {
  try {
    const today = "2026-04-05";
    const data = await analyticsService.getDashboardData(today, today);
    console.log("SUCCESS:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
