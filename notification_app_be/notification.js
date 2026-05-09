const axios = require("axios");
const Log = require("./logger");

const TOKEN = "YOUR_ACCESS_TOKEN";

const PRIORITY = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function fetchNotifications() {
  try {
    await Log(
      "frontend",
      "info",
      "api",
      "Fetching notifications from API"
    );

    const response = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    const notifications = response.data.notifications;

    await Log(
      "frontend",
      "info",
      "api",
      "Notifications fetched successfully"
    );

    // Sort by priority and timestamp
    notifications.sort((a, b) => {

      // priority comparison
      const priorityDiff =
        PRIORITY[b.Type] - PRIORITY[a.Type];

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // recent notifications first
      return (
        new Date(b.Timestamp) -
        new Date(a.Timestamp)
      );
    });

    const top10 = notifications.slice(0, 10);

    await Log(
      "frontend",
      "info",
      "component",
      "Top 10 notifications calculated"
    );

    console.log("\nTOP 10 NOTIFICATIONS\n");

    top10.forEach((item, index) => {
      console.log(
        `${index + 1}. [${item.Type}] ${item.Message}`
      );
    });

  } catch (error) {

    await Log(
      "frontend",
      "error",
      "api",
      "Failed to fetch notifications"
    );

    console.error(error.response?.data || error.message);
  }
}

fetchNotifications();