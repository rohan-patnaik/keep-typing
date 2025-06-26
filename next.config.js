/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
};

const sentryWebpackPluginOptions = {
  // For all available options, see: https://github.com/getsentry/sentry-webpack-plugin#options
  silent: true, // Suppresses all webpack plugin console messages except errors
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
