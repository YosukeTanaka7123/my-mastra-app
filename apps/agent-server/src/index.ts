import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Agent!");
});

serve(
  {
    fetch: app.fetch,
    port: 8282,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
