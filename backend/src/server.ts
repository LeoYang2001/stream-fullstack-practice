import { fastify } from "fastify";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import { ScoreboardService } from "./generated/proto/scoreboard_connect.js";
import {
  SubscribeScoresRequest,
  ScoreUpdate,
} from "./generated/proto/scoreboard_pb.js";
import type { ServiceImpl } from "@connectrpc/connect";

// ConnectRPC service implementation
const scoreboardServiceImpl: ServiceImpl<typeof ScoreboardService> = {
  async *subscribeScores(request: SubscribeScoresRequest) {
    console.log(`🏀 Client subscribed to game: ${request.gameId}`);

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

      const update = new ScoreUpdate({
        gameId: request.gameId,
        teamHome: "Kentucky Wildcats",
        teamAway: "Duke Blue Devils",
        scoreHome: homeScore,
        scoreAway: awayScore,
        status: quarters[i],
      });

      console.log(
        `📊 ${update.status}: ${update.teamHome} ${update.scoreHome} - ${update.scoreAway} ${update.teamAway}`
      );

      yield update;

      // Wait between updates (2 seconds for demo)
      if (i < quarters.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log(`🏁 Game ${request.gameId} finished`);
  },
};

// Create Fastify server with ConnectRPC
async function main() {
  const server = fastify({ logger: true });

  // Add CORS for web clients
  await server.register(import("@fastify/cors"), {
    origin: true, // Allow all origins for development
  });

  // Register ConnectRPC plugin
  await server.register(fastifyConnectPlugin, {
    routes: (router) => {
      router.service(ScoreboardService, scoreboardServiceImpl);
    },
  });

  // Start server
  try {
    await server.listen({ port: 8080, host: "0.0.0.0" });
    console.log("🚀 ConnectRPC server running on http://localhost:8080");
    console.log("🏀 Ready to stream basketball scores!");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
