// test-connectrpc-client.js
import { createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { ScoreboardService } from "./backend/src/generated/proto/scoreboard_connect.ts";

async function testConnectRPCStreaming() {
  console.log("🏀 Testing ConnectRPC streaming...\n");

  try {
    // Create transport
    const transport = createConnectTransport({
      httpVersion: "1.1",
      baseUrl: "http://localhost:8080",
    });

    // Create client
    const client = createPromiseClient(ScoreboardService, transport);

    console.log("📡 Connecting to ConnectRPC stream...\n");

    // Subscribe to scores
    for await (const update of client.subscribeScores({
      gameId: "wildcats-vs-duke",
    })) {
      console.log(
        `🏀 ${update.status}: ${update.teamHome} ${update.scoreHome} - ${update.scoreAway} ${update.teamAway}`
      );
    }

    console.log("\n🏁 Stream completed!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
  }
}

testConnectRPCStreaming();
