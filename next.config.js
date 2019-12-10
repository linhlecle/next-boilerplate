const { resolve } = require('path');
const prod = process.env.NODE_ENV === 'production';
const { parsed: localEnv } = require('dotenv').config({
  path: resolve(process.cwd(), prod ? '.env' : '.env.development'),
});
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const webpack = require('webpack');

module.exports = withBundleAnalyzer({
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|svg)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024,
          },
        },
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              enabled: true,
              progressive: true,
              quality: 65,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 7,
            },
            pngquant: {
              quality: [0.65, 0.9],
              speed: 4,
            },
          },
        },
      ],
    });
    config.optimization = {
      ...config.optimization,
      sideEffects: true,
      usedExports: true,
    };
    config.resolve.modules.push(resolve('./'));
    return config;
  },
});
