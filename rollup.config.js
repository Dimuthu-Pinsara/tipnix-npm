import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import terser from '@rollup/plugin-terser';

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json"
    }),
    postcss({
      extract: "tipnix.css",   // → dist/tipnix.css
      minimize: true,
      sourceMap: true
    }),
    terser()
  ],
  external: [
    "tslib"
  ]
};