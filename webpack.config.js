const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'ReactFeedbackWidget',
    libraryTarget: 'umd',
    clean: true,
    globalObject: 'this'
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
    },
    'sonner': {
      commonjs: 'sonner',
      commonjs2: 'sonner',
      amd: 'sonner',
      root: 'sonner',
      optional: true
    }
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            passes: 2
          },
          mangle: {
            safari10: true
          }
        }
      })
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not ie <= 11']
                  },
                  modules: false
                }],
                '@babel/preset-react',
                '@babel/preset-typescript'
              ]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8
    }),
    ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: true
    })] : [])
  ],

  devtool: 'source-map',
  
  stats: {
    errorDetails: true,
    warnings: true
  }
};
