/**
 * @fileoverview Webpack configuration optimized for tree-shaking and performance
 * @author ArlindMaliqi
 * @version 2.0.0
 */

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Determine environment - default to 'development' if not set
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const shouldAnalyze = process.env.ANALYZE === 'true';

const createConfig = (format = 'umd') => {
  const isESM = format === 'esm';
  
  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isESM ? 'index.esm.js' : 'index.js',
      library: isESM ? undefined : {
        name: 'ReactFeedbackReportWidget',
        type: 'umd',
      },
      libraryTarget: isESM ? 'module' : 'umd',
      umdNamedDefine: !isESM,
      globalObject: 'typeof self !== "undefined" ? self : this',
      clean: false,
      ...(isESM && {
        environment: { module: true },
        chunkFormat: 'module',
      }),
    },
    ...(isESM && {
      experiments: {
        outputModule: true,
      },
    }),
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { 
                  targets: { node: 'current' },
                  modules: isESM ? false : 'auto'
                }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    externals: {
      react: isESM ? 'react' : {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'React',
        root: 'React',
      },
      'react-dom': isESM ? 'react-dom' : {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'ReactDOM',
        root: 'ReactDOM',
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      }),
      ...(isProduction ? [
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 8192,
          minRatio: 0.8,
        }),
      ] : []),
      ...(shouldAnalyze && !isESM ? [new BundleAnalyzerPlugin()] : []),
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction,
            },
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    stats: {
      children: false,
      modules: false,
    },
  };
};

module.exports = (env = {}) => {
  // Clean dist directory only once at the start of UMD build
  if (env.format === 'umd' || !env.format) {
    const fs = require('fs');
    const rimraf = require('rimraf');
    if (fs.existsSync('dist')) {
      rimraf.sync('dist');
    }
  }
  
  return createConfig(env.format);
};
