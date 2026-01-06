import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  unbundle: true,
  dts: true,
  platform: "neutral",
  clean: true,
  sourcemap: true,
  exports: true,
});
