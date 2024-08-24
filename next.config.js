// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    // distDir: 'build',
    // output: 'export',
    // images: {
    //     unoptimized: true,
    // },
    // trailingSlash: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        icon: true,
                    },
                },
            ],
        });

        return config;
    },
};

module.exports = nextConfig;
