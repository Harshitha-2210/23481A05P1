// notification_app_be/priority_notifications.js
// Stage 1: Get top 10 priority notifications

const { log } = require("../logging_middleware/logger.js");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoYXJzaGl0aGF2YXJhZGEyMjEwQGdtYWlsLmNvbSIsImV4cCI6MTc3ODMxMDkyMywiaWF0IjoxNzc4MzEwMDIzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNWZjMTQ0OWQtNmU0NC00NDkxLWFhYjgtYjIzODVkNDM4NzAxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmFyYWRhIGt1c3VtYSBuYWdhIHNyaSBoYXJzaGl0aGEiLCJzdWIiOiJkMGI0NjAyMi0zMDA2LTRmYTEtYjVkMC0wZmVlN2JmMDU3NDkifSwiZW1haWwiOiJoYXJzaGl0aGF2YXJhZGEyMjEwQGdtYWlsLmNvbSIsIm5hbWUiOiJ2YXJhZGEga3VzdW1hIG5hZ2Ugc3JpIGhhcnNoaXRoYSIsInJvbGxObyI6IjIzNDgxYTA1cDEiLCJhY2Nlc3NDb2RlIjoiZUpkQ3VDIiwiY2xpZW50SUQiOiJkMGI0NjAyMi0zMDA2LTRmYTEtYjVkMC0wZmVlN2JmMDU3NDkiLCJjbGllbnRTZWNyZXQiOiJoeHpwc2NFSFBRWkdnVmtNIn0.z0EDSXmezja3dwkG_9ffiWHXMV9NCKdJ76bSP0XGr5g";

// Priority weights for different notification types
function getTypeWeight(type) {
    if (type === "Placement") return 100;
    if (type === "Result") return 50;
    if (type === "Event") return 10;
    return 0;
}

// Convert timestamp to comparable number
function getRecencyScore(timestamp) {
    const notifTime = new Date(timestamp.replace(' ', 'T'));
    const now = new Date();
    const diffMs = now - notifTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    let score = Math.max(0, 100 - (diffHours * 2));
    return Math.min(100, score);
}

// Calculate total priority score
function calculatePriority(notification) {
    const weight = getTypeWeight(notification.Type);
    const recency = getRecencyScore(notification.Timestamp);
    const total = weight + recency;
    
    return {
        ...notification,
        priorityScore: total,
        weight: weight,
        recency: recency
    };
}

// Fetch notifications from API
async function fetchNotifications() {
    await log("backend", "debug", "controller", "Fetching notifications from API");
    
    try {
        const response = await fetch("http://4.224.186.213/evaluation-service/notifications", {
            headers: {
                "Authorization": `Bearer ${TOKEN}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        await log("backend", "info", "controller", 
            `Successfully fetched ${data.notifications ? data.notifications.length : 0} notifications`);
        
        return data.notifications || [];
        
    } catch (error) {
        await log("backend", "error", "handler", 
            `Failed to fetch notifications: ${error.message}`);
        throw error;
    }
}

// Get top N priority notifications
async function getTopPriorityNotifications(limit = 10) {
    await log("backend", "info", "service", `Calculating top ${limit} priority notifications`);
    
    try {
        const notifications = await fetchNotifications();
        
        if (!notifications.length) {
            await log("backend", "warn", "service", "No notifications found");
            return [];
        }
        
        const withPriority = notifications.map(n => calculatePriority(n));
        const sorted = withPriority.sort((a, b) => b.priorityScore - a.priorityScore);
        const topN = sorted.slice(0, limit);
        
        await log("backend", "info", "service", 
            `Top ${limit} notifications calculated. Highest score: ${topN[0]?.priorityScore || 0}`);
        
        return topN;
        
    } catch (error) {
        await log("backend", "error", "service", `Priority calculation failed: ${error.message}`);
        throw error;
    }
}

// Display results nicely
function displayNotifications(notifications, title = "Priority Notifications") {
    console.log(`\n📋 ${title}`);
    console.log("=".repeat(80));
    
    notifications.forEach((n, index) => {
        console.log(`${index + 1}. [${n.Type}] ${n.Message}`);
        console.log(`   ID: ${n.ID}`);
        console.log(`   Time: ${n.Timestamp}`);
        console.log(`   Score: ${n.priorityScore} (Weight: ${n.weight}, Recency: ${n.recency.toFixed(1)})`);
        console.log("-".repeat(80));
    });
}

// Main execution
async function main() {
    console.log("🚀 Starting Priority Notification System - Stage 1");
    await log("backend", "info", "service", "Priority notification system started");
    
    try {
        const top10 = await getTopPriorityNotifications(10);
        
        if (top10.length > 0) {
            displayNotifications(top10, `TOP ${top10.length} PRIORITY NOTIFICATIONS`);
            
            console.log(`\n✅ Successfully identified ${top10.length} priority notifications`);
            console.log("💡 Highest priority notification:");
            console.log(`   Type: ${top10[0].Type} | Message: ${top10[0].Message}`);
            console.log(`   Score: ${top10[0].priorityScore}`);
        } else {
            console.log("❌ No notifications found");
        }
        
        await log("backend", "info", "service", 
            `Priority notification calculation completed. Found ${top10.length} notifications`);
        
    } catch (error) {
        console.error("❌ Script failed:", error.message);
        await log("backend", "fatal", "service", `Script failed: ${error.message}`);
    }
}

// Run the script
main();