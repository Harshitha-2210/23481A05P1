// notification_app_be/getToken.js
// Use CommonJS require instead of import

const { log } = require("../logging_middleware/logger.js");
const fs = require('fs');

// Use the token you already have
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoYXJzaGl0aGF2YXJhZGEyMjEwQGdtYWlsLmNvbSIsImV4cCI6MTc3ODMwNzczNSwiaWF0IjoxNzc4MzA2ODM1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZTExYjU1N2QtZjUzZS00OGMyLWE5MGEtZGNhYzQzMmQ0YzcyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmFyYWRhIGt1c3VtYSBuYWdhIHNyaSBoYXJzaGl0aGEiLCJzdWIiOiJkMGI0NjAyMi0zMDA2LTRmYTEtYjVkMC0wZmVlN2JmMDU3NDkifSwiZW1haWwiOiJoYXJzaGl0aGF2YXJhZGEyMjEwQGdtYWlsLmNvbSIsIm5hbWUiOiJ2YXJhZGEga3VzdW1hIG5hZ2Egc3JpIGhhcnNoaXRoYSIsInJvbGxObyI6IjIzNDgxYTA1cDEiLCJhY2Nlc3NDb2RlIjoiZUpkQ3VDIiwiY2xpZW50SUQiOiJkMGI0NjAyMi0zMDA2LTRmYTEtYjVkMC0wZmVlN2JmMDU3NDkiLCJjbGllbnRTZWNyZXQiOiJoeHpwc2NFSFBRWkdnVmtNIn0.7g2tyNTjCydEkG3v7uQxw_6y8r1UA4tjd1w8Kg30VCs";

async function testLog() {
    console.log("Testing log function...");
    
    // Test different log types
    await log("frontend", "info", "component", "Test log from getToken script");
    await log("backend", "debug", "controller", "Checking if logging works");
    await log("frontend", "warn", "api", "This is a warning test");
    await log("backend", "error", "handler", "Test error message");
    
    console.log("\n✅ Log test completed!");
    console.log("💾 Your token is ready to use");
    
    // Save token to file
    fs.writeFileSync('.token', TOKEN);
    console.log("📁 Token saved to .token file");
}

testLog();