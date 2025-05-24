import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello MCP!");
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

serve(
  {
    fetch: app.fetch,
    port: 8283,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
