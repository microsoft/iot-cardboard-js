import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import json from '@rollup/plugin-json';
import eslint from '@rollup/plugin-eslint';

const packageJson = require('./package.json');

export default {
    input: 'src/index.ts',
    output: [
        {
            file: `dist/${packageJson.main}`,
            format: 'cjs',
            sourcemap: true
        },
        {
            file: `dist/${packageJson.module}`,
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        eslint({
            throwOnError: true
        }),
        typescript({ useTsconfigDeclarationDir: true }),
        postcss({
            plugins: [
                postcssUrl({
                    url: 'inline'
                })
            ]
        }),
        json()
    ]
};
