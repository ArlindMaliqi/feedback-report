/**
 * @fileoverview Webpack configuration optimized for tree-shaking and performance
 * @author ArlindMaliqi
 * @version 2.0.0
 */

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProduction = process.env.NODE_ENV === 'production';
const shouldCompress = process.env.COMPRESS === 'true';
const shouldAnalyze = process.env.ANALYZE === 'true';

const baseConfig = {
  entry: './src/index.ts',
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
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    ...(shouldAnalyze ? [new BundleAnalyzerPlugin()] : []),
  ],
};

module.exports = (env = {}) => {
  const format = env.format || 'umd';
  
  if (format === 'esm') {
    return {
      ...baseConfig,
      externalsType: 'module',
      externals: {
        'react': 'react',
        'react-dom': 'react-dom',
      },
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: shouldCompress ? 'index.esm.min.js' : 'index.esm.js',
        library: {
          type: 'module',
        },
        environment: {
          module: true,
        },
        chunkFormat: 'module',
      },
      experiments: {
        outputModule: true,
      },
      optimization: {
        minimize: shouldCompress,
        minimizer: shouldCompress ? [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
              },
              mangle: true,
              format: {
                comments: false,
              },
            },
            extractComments: false,
          }),
        ] : [],
        // Disable hash generation for ESM externals to avoid the error
        moduleIds: 'named',
        chunkIds: 'named',
      },
      devtool: shouldCompress ? false : 'source-map',
      plugins: [
        ...baseConfig.plugins,
        ...(shouldCompress ? [
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 8192,
            minRatio: 0.8,
          }),
        ] : []),
      ],
    };
  }

  // UMD format (default)
  return {
    ...baseConfig,
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM',
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: shouldCompress ? 'index.min.js' : 'index.js',
      library: {
        name: 'ReactFeedbackWidget',
        type: 'umd',
      },
      globalObject: 'typeof self !== "undefined" ? self : this',
    },
    optimization: {
      minimize: shouldCompress,
      minimizer: shouldCompress ? [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
            mangle: true,
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ] : [],
    },
    devtool: shouldCompress ? false : 'source-map',
    plugins: [
      ...baseConfig.plugins,
      ...(shouldCompress ? [
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 8192,
          minRatio: 0.8,
        }),
      ] : []),
    ],
  };
};
