import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "@/env";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	experimental: {
		reactCompiler: true,
		ppr: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
