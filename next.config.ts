import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "@/env";
import { routing } from "@/i18n/routing";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	experimental: {
		reactCompiler: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},

  async redirects() {
    return [...routing.locales.map(locale => ({
      source: `/${locale}/playground`,
      destination: `/${locale}/playground/bubble`,
      permanent: true,
    }))]
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
