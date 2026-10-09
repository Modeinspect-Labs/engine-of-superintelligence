// Plain .mjs on purpose: tools that wrap this file (modeinspect's sandbox
// does, to add its source-mapping plugin) generate an untyped wrapper beside
// it, and a .ts wrapper would trip `tsc --noEmit` under `strict`.

/** @type {import("next").NextConfig} */
const nextConfig = {
  // The floating dev badge sits on top of the sidebar footer in demos.
  devIndicators: false,
  // AGENTS.md is hand-written for this app; don't let `next dev` append to it.
  agentRules: false,
};

export default nextConfig;
