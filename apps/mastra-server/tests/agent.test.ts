import "dotenv/config";

import { mastra } from "~/mastra";

async function main() {
  const agent = mastra.getAgent("weatherAgent");

  console.log("天気エージェントをテスト中...");

  // 山形の天気を日本語で質問
  const result = await agent.generate("山形の天気を教えてください");

  console.log("エージェントの応答:", result.text);

  // 東京の天気も試してみる
  console.log("\n---\n");
  const result2 = await agent.generate("東京の現在の天気はどうですか？");
  console.log("エージェントの応答:", result2.text);
}

main().catch(console.error);
