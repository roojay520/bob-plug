import { RollupOptions, Plugin, OutputOptions } from 'rollup';
import json from '@rollup/plugin-json';
import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const plugins: Plugin[] = [
  json({ namedExports: false }),
  resolve({
    extensions: ['.js', '.ts'],
    modulesOnly: true,
    preferBuiltins: false,
  }),
  commonjs(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  nodePolyfills(),
  esbuild({
    include: /\.[jt]?s$/,
    exclude: /node_modules/,
    sourceMap: false,
    minify: process.env.NODE_ENV === 'production',
    target: 'es6',
    loaders: {
      '.json': 'json',
    },
  }),
];
const globals = {
  $util: '$util',
  $http: '$http',
  $info: '$info',
  $option: '$option',
  $log: '$log',
  $data: '$data',
  $file: '$file',
};
// 输入的文件配置
export const initOptByProjectRootPath = (projectPath: string) => {
  const inputOptions: RollupOptions = {
    input: `${projectPath}/src/index.ts`,
    plugins,
    external: ['crypto-js'],
  };
  const outCjs: OutputOptions = {
    format: 'cjs',
    exports: 'named',
    globals,
    file: `${projectPath}/lib/index.cjs.js`,
  };
  const outEsm: OutputOptions = {
    format: 'es',
    exports: 'named',
    globals,
    file: `${projectPath}/lib/index.esm.js`,
  };

  return {
    inputOptions,
    outCjs,
    outEsm,
  };
};
