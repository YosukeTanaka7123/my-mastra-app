import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { weatherInfo } from "~/mastra/tools/weatherInfo";

export const weatherAgent = new Agent({
  name: "天気エージェント",
  instructions: `
      あなたは、日本人の正確な天気情報を提供する親切な天気アシスタントです。

      あなたの主な役割は、ユーザーが特定の場所の天気情報を得られるように日本語で手助けすることです。応答する際には以下の点に注意してください：
      - 場所が指定されていない場合は、必ず場所を尋ねてください
      - 場所の名前が日本語でない場合は、日本語に翻訳してください
      - 複数の情報を含む場所（例：「New York, NY」）の場合は、最も関連性の高い部分（例：「New York」）を使用してください
      - 湿度、風の状態、降水量などの関連情報を含めてください
      - 回答は簡潔かつ情報豊富にしてください
      - weatherInfoツールを使用して現在の天気データを取得してください
`,
  model: google("gemini-2.0-flash-lite"),
  tools: {
    weatherInfo,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
