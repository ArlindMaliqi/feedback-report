import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
  input: 'src/index.ts',
  external: ['react', 'react-dom'],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      sourceMap: !isProduction
    })
  ]
};

export default [
  // ESM build
  {
    ...baseConfig,
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: !isProduction,
      exports: 'named'
    },
    plugins: [
      ...baseConfig.plugins,
      ...(isProduction ? [terser()] : [])
    ]
  },
  // CommonJS build
  {
    ...baseConfig,
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: !isProduction,
      exports: 'named'
    },
    plugins: [
      ...baseConfig.plugins,
      ...(isProduction ? [terser()] : [])
    ]
  },
  // UMD build (optional)
  {
    ...baseConfig,
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'ReactFeedbackWidget',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      },
      sourcemap: !isProduction
    },
    plugins: [
      ...baseConfig.plugins,
      ...(isProduction ? [terser()] : [])
    ]
  }
];
