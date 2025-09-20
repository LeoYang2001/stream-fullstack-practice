// simple-test-client.js
async function streamScores() {
  console.log("🏀 Connecting to basketball score stream...\n");

  try {
    const response = await fetch("http://localhost:8080/scoreboard/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: "wildcats-vs-duke",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    console.log("📡 Stream connected! Waiting for score updates...\n");

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("\n🏁 Game stream ended!");
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // Split by newlines to handle streaming JSON
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const update = JSON.parse(line);
            console.log(
              `🏀 ${update.status}: ${update.teamHome} ${update.scoreHome} - ${update.scoreAway} ${update.teamAway}`
            );
          } catch (e) {
            console.log("📦 Raw data:", line.trim());
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the stream
streamScores();
