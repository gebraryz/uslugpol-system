import { NextConfig } from "next";

const nextConfig = {
  transpilePackages: [
    "@uslugpol/core",
    "@uslugpol/event-service",
    "@uslugpol/car-service",
  ],
} satisfies NextConfig;

export default nextConfig;
