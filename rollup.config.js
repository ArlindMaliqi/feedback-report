import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const external = ['react', 'react-dom', 'react/jsx-runtime'];

const config = [
  // ESM build
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      nodeResolve({ preferBuiltins: false }),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        removeComments: true
      }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ]
  },
  // CJS build
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      nodeResolve({ preferBuiltins: false }),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        removeComments: true
      }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ]
  }
];

export default config;
