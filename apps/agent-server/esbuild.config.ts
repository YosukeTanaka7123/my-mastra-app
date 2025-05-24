import * as esbuild from "esbuild";

await esbuild.build({
  platform: "node",
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "dist",
  format: "esm",
  outExtension: { ".js": ".mjs" },
  minify: true,
});
