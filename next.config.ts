import type { NextConfig } from "next";
import { withContentlayer } from 'next-contentlayer';

const nextConfig: NextConfig = {
  /* config options here */
  // 静态导出
	output: 'export',
  reactStrictMode: true,
	swcMinify: true,
};

export default withContentlayer(nextConfig);
