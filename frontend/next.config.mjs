/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'uploader-experimental.s3.eu-west-2.amazonaws.com',
    }]
  }
};

export default nextConfig;
