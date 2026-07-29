import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

rmSync("dist/index.html", { force: true });
rmSync("dist/assets", { force: true, recursive: true });
rmSync("dist/server", { force: true, recursive: true });
rmSync("dist/.openai", { force: true, recursive: true });
mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });

copyFileSync(".openai/hosting.json", "dist/.openai/hosting.json");

writeFileSync(
  "dist/server/index.js",
  `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
`,
  "utf8"
);
