import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import json from '@rollup/plugin-json';
import eslint from '@rollup/plugin-eslint';
import dts from 'rollup-plugin-dts';

const inputs = {
    index: 'src/index.ts',
    Adapters: 'src/Adapters/index.ts',
    // Cards entry points
    Cards: 'src/Cards/index.ts',
    // Component entry points
    'Components/StandalonePropertyInspector':
        'src/Components/PropertyInspector/StandalonePropertyInspector.tsx',
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
        extract: true,
        plugins: [
            postcssUrl({
                url: 'inline'
            })
        ]
    })
];

const config = [
    {
        input: inputs,
        output: [
            {
                dir: 'dist',
                format: 'esm',
                sourcemap: true,
                exports: 'named'
            }
        ],
        plugins: commonPlugins
    },
    {
        input: inputs,
        output: [{ dir: 'dist', format: 'es', exports: 'named' }],
        // external: [/\.scss$/], // ignore .scss file
        plugins: [...commonPlugins, dts()]
    }
];

export default config;
