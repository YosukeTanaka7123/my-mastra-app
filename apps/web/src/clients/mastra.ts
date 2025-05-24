import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({
  baseUrl: "http://localhost:4111", // デフォルトのMastra開発サーバーポート
});

export const weatherAgent = client.getAgent("weatherAgent");
