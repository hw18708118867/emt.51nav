import createMDX from "@next/mdx";

const withMDX = createMDX({});
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  pageExtensions: ["js", "jsx", "mdx"],
  basePath,
  assetPrefix: basePath || undefined
};

export default withMDX(nextConfig);
