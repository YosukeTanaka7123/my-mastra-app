import "dotenv/config";

import { mastra } from "./mastra";

async function main() {
  const agent = mastra.getAgent("weatherAgent");

  const result = await agent.generate("What is the weather in Yamagata?");

  console.log("Agent response:", result.text);
}

main();
