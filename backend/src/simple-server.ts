import { fastify } from "fastify";

// Simple HTTP streaming server
async function main() {
  const server = fastify({ logger: true });

  // Add CORS for web clients
  await server.register(import("@fastify/cors"), {
    origin: true, // Allow all origins for development
  });

  // Simple HTTP endpoint for streaming scores
  server.post("/scoreboard/stream", async (request, reply) => {
    const { gameId } = request.body as { gameId: string };

    console.log(`🏀 Client subscribed to game: ${gameId}`);

    // Set headers for Server-Sent Events
    reply.type("text/plain");
    reply.header("Cache-Control", "no-cache");
    reply.header("Connection", "keep-alive");

    // Simulate live game updates
    const quarters = ["1Q", "2Q", "HALF", "3Q", "4Q", "FINAL"];
    let homeScore = 0;
    let awayScore = 0;

    for (let i = 0; i < quarters.length; i++) {
      // Simulate score changes
      if (i < 4) {
        homeScore += Math.floor(Math.random() * 8) + 5; // 5-12 points
        awayScore += Math.floor(Math.random() * 8) + 5;
      }

      const update = {
        gameId: gameId,
        teamHome: "Kentucky Wildcats",
        teamAway: "Duke Blue Devils",
        scoreHome: homeScore,
        scoreAway: awayScore,
        status: quarters[i],
      };

      console.log(
        `📊 ${update.status}: ${update.teamHome} ${update.scoreHome} - ${update.scoreAway} ${update.teamAway}`
      );

      // Send JSON data followed by newline
      reply.raw.write(JSON.stringify(update) + "\n");

      // Wait between updates (2 seconds for demo)
      if (i < quarters.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log(`🏁 Game ${gameId} finished`);
    reply.raw.end();
  });

  // Start server
  try {
    await server.listen({ port: 8080, host: "0.0.0.0" });
    console.log("🚀 Simple streaming server running on http://localhost:8080");
    console.log("🏀 Ready to stream basketball scores!");
    console.log(
      "📡 Test with: curl -X POST http://localhost:8080/scoreboard/stream -H 'Content-Type: application/json' -d '{\"gameId\": \"wildcats-vs-duke\"}'"
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
