import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import json from '@rollup/plugin-json';
import eslint from '@rollup/plugin-eslint';
import dts from 'rollup-plugin-dts';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
const parseExportListFromIndex = require('./tools/index-parser');

// Build map of library entry points -- this allows for splitting library into chunks & tree shaking
const inputs = {
    index: 'src/index.ts',
    Adapters: 'src/Adapters/index.ts',
    // Cards entry points -- index MUST use [export { default as <name> } from './<path>'] syntax
    ...parseExportListFromIndex(
        './src/Cards/index.ts',
        'src/Cards',
        '.tsx',
        'Cards'
    ),
    // Component entry points -- index MUST use [export { default as <name> } from './<path>'] syntax
    ...parseExportListFromIndex(
        './src/Components/index.ts',
        'src/Components',
        '.tsx',
        'Components'
    ),
    // Page entry points -- index MUST use [export { default as <name> } from './<path>'] syntax
    ...parseExportListFromIndex(
        './src/Pages/index.ts',
        'src/Pages',
        '.tsx',
        'Pages'
    ),
    Classes: 'src/Models/Classes/index.ts',
    Constants: 'src/Models/Constants/index.ts',
    Hooks: 'src/Models/Hooks/index.ts',
    Services: 'src/Models/Services/index.ts'
};

const commonPlugins = [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    eslint({
        throwOnError: true
    }),
    typescript(),
    json(),
    postcss({
        plugins: [
            postcssUrl({
                url: 'inline'
            })
        ]
    }),
    url(),
    svgr()
];

const config = [
    // Create esm output chunks for built library
    {
        input: inputs,
        output: [
            {
                dir: 'dist',
                format: 'esm',
                sourcemap: true,
                exports: 'named',
                chunkFileNames: 'internal/[name]-[hash].js'
            }
        ],
        plugins: commonPlugins
    },
    // Rollup .d.ts typing files associated to each chunk
    {
        input: inputs,
        output: [
            {
                dir: 'dist',
                format: 'es',
                exports: 'named',
                chunkFileNames: 'internal/[name]-[hash].d.ts'
            }
        ],
        plugins: [...commonPlugins, dts()]
    }
];

export default config;
