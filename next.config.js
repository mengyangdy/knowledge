/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'react-dom': require.resolve('react-dom'),
        'lottie-web': require.resolve('lottie-web'),
      };
    }
    return config;
  },
  transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-foundation', 'lottie-web'],
  // 添加 experimental 配置
  experimental: {
    // 允许使用客户端组件
    serverComponentsExternalPackages: ['@douyinfe/semi-ui'],
  }
}

module.exports = nextConfig 