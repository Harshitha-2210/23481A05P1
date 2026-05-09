// notification_app_be/app.js (COMPLETE VERSION)
const express = require('express');
const cors = require('cors');
const { log } = require("../logging_middleware/logger.js");

const app = express();

// Your token
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoYXJzaGl0aGF2YXJhZGEyMjEwQGdtYWlsLmNvbSIsImV4cCI6MTc3ODMxMDkyMywiaWF0IjoxNzc4MzEwMDIzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNWZjMTQ0OWQtNmU0NC00NDkxLWFhYjgtYjIzODVkNDM4NzAxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmFyYWRhIGt1c3VtYSBuYWdhIHNyaSBoYXJzaGl0aGEiLCJzdWIiOiJkMGI0NjAyMi0zMDA2LTRmYTEtYjVkMC0wZmVlN2JmMDU3NDkifSwiZW1haWwiOiJoYXJzaGl0aGF2YXJhZGEyMjEwQGdtYWlsLmNvbSIsIm5hbWUiOiJ2YXJhZGEga3VzdW1hIG5hZ2Ugc3JpIGhhcnNoaXRoYSIsInJvbGxObyI6IjIzNDgxYTA1cDEiLCJhY2Nlc3NDb2RlIjoiZUpkQ3VDIiwiY2xpZW50SUQiOiJkMGI0NjAyMi0zMDA2LTRmYTEtYjVkMC0wZmVlN2JmMDU3NDkiLCJjbGllbnRTZWNyZXQiOiJoeHpwc2NFSFBRWkdnVmtNIn0.z0EDSXmezja3dwkG_9ffiWHXMV9NCKdJ76bSP0XGr5g";

app.use(cors());
app.use(express.json());

// Get all notifications
app.get('/api/notifications', async (req, res) => {
    await log("backend", "info", "controller", "API call: Fetch all notifications");
    
    try {
        const response = await fetch("http://4.224.186.213/evaluation-service/notifications", {
            headers: { 
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        
        const data = await response.json();
        
        await log("backend", "info", "controller", 
            `Returning ${data.notifications?.length || 0} notifications`);
        
        res.json(data.notifications || []);
        
    } catch (error) {
        await log("backend", "error", "handler", `API error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
    log("backend", "info", "config", `Server started on port ${PORT}`);
});