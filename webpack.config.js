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
const shouldAnalyze = process.env.ANALYZE === 'true';

/**
 * Base webpack configuration
 */
const baseConfig = {
  mode: isProduction ? 'production' : 'development',
  
  entry: {
    index: './src/index.tsx',
    'index.esm': './src/index.tsx'
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      name: 'ReactFeedbackReportWidget',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this',
    clean: true
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM'
    }
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: isProduction,
              compilerOptions: {
                declaration: true,
                declarationDir: './dist',
                outDir: './dist'
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        sideEffects: false
      }
    ]
  },
  
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction,
            pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : []
          },
          mangle: {
            keep_classnames: false,
            keep_fnames: false
          },
          output: {
            comments: false
          }
        },
        extractComments: false
      })
    ],
    
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5
        }
      }
    },
    
    sideEffects: false,
    usedExports: true,
    innerGraph: true
  },
  
  plugins: [
    ...(isProduction ? [
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 8192,
        minRatio: 0.8
      })
    ] : []),
    
    ...(shouldAnalyze ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-analysis.html',
        openAnalyzer: false
      })
    ] : [])
  ],
  
  stats: {
    assets: true,
    modules: false,
    chunks: false,
    children: false,
    entrypoints: false
  }
};

/**
 * ESM-specific configuration
 */
const esmConfig = {
  ...baseConfig,
  entry: './src/index.tsx',
  output: {
    ...baseConfig.output,
    filename: 'index.esm.js',
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true
  }
};

module.exports = [baseConfig, esmConfig];
