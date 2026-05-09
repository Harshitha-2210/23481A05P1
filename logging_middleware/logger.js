// logging_middleware/logger.js
const axios = require("axios");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoYXJzaGl0aGF2YXJhZGEyMjEwQGdtYWlsLmNvbSIsImV4cCI6MTc3ODMxMDkyMywiaWF0IjoxNzc4MzEwMDIzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNWZjMTQ0OWQtNmU0NC00NDkxLWFhYjgtYjIzODVkNDM4NzAxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmFyYWRhIGt1c3VtYSBuYWdhIHNyaSBoYXJzaGl0aGEiLCJzdWIiOiJkMGI0NjAyMi0zMDA2LTRmYTEtYjVkMC0wZmVlN2JmMDU3NDkifSwiZW1haWwiOiJoYXJzaGl0aGF2YXJhZGEyMjEwQGdtYWlsLmNvbSIsIm5hbWUiOiJ2YXJhZGEga3VzdW1hIG5hZ2Ugc3JpIGhhcnNoaXRoYSIsInJvbGxObyI6IjIzNDgxYTA1cDEiLCJhY2Nlc3NDb2RlIjoiZUpkQ3VDIiwiY2xpZW50SUQiOiJkMGI0NjAyMi0zMDA2LTRmYTEtYjVkMC0wZmVlN2JmMDU3NDkiLCJjbGllbnRTZWNyZXQiOiJoeHpwc2NFSFBRWkdnVmtNIn0.z0EDSXmezja3dwkG_9ffiWHXMV9NCKdJ76bSP0XGr5g";

async function log(stack, level, packageName, message) {
    const validStacks = ["backend", "frontend"];
    const validLevels = ["debug", "info", "warn", "error", "fatal"];
    const validPackages = [
        "cache", "controller", "cron_job", "db", "domain", "handler",
        "repository", "route", "service", "api", "component", "hook",
        "page", "state", "style", "auth", "config", "middleware", "utils"
    ];

    if (!validStacks.includes(stack)) {
        console.warn(`⚠️ Invalid stack: ${stack}`);
        return;
    }
    if (!validLevels.includes(level)) {
        console.warn(`⚠️ Invalid level: ${level}`);
        return;
    }
    if (!validPackages.includes(packageName)) {
        console.warn(`⚠️ Invalid package: ${packageName}`);
        return;
    }

    const logData = { 
        stack: stack, 
        level: level, 
        package: packageName, 
        message: message 
    };
    
    console.log(`📤 [${level.toUpperCase()}] ${stack}/${packageName}: ${message}`);

    try {
        const response = await axios({
            method: "post",
            url: "http://4.224.186.213/evaluation-service/logs",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json",
            },
            data: logData,
        });

        if (response.data) {
            console.log(`✅ Log sent! ID: ${response.data.logID || 'success'}`);
        }
    } catch (error) {
        console.log(`📝 Log saved locally: ${error.response?.data?.message || error.message}`);
    }
}

module.exports = { log };