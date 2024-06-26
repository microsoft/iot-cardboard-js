const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const postcssUrl = require('postcss-url');
const AppSourceDir = path.join(__dirname, '..', 'src');
import { loadCsf } from '@storybook/csf-tools';
import { readFile } from 'fs-extra';

module.exports = {
    stories:
        process.env.NODE_ENV === 'production'
            ? // Change below to ['../src/Components/**/*.stories.tsx'] to include Card stories
              [
                  '../src/Components/**/*.stories.tsx',
                  '../src/Models/**/*.stories.tsx',
                  '../src/Pages/**/*.stories.tsx'
              ]
            : // Change below to ['../src/**/*.stories.tsx', '../src/**/*.stories.local.tsx'] to include Card stories
              [
                  '../src/Components/**/*.stories.tsx',
                  '../src/Models/**/*.stories.tsx',
                  '../src/Pages/**/*.stories.tsx',
                  '../src/Components/**/*.stories.local.tsx',
                  '../src/Pages/**/*.stories.local.tsx'
              ],
    // Required for .local stories, this just parses the files and includes the stories
    experimental_indexers: async (existingIndexers) => {
        const localIndexer = {
            test: /\.stories\.local\.tsx?$/,
            createIndex: async (fileName, opts) => {
                const code = (await readFile(fileName, 'utf-8')).toString();
                return loadCsf(code, { ...opts, fileName }).parse().indexInputs;
            }
        };
        const indexers =
            process.env.NODE_ENV === 'production'
                ? [...existingIndexers]
                : [...existingIndexers, localIndexer];
        return indexers;
    },
    // Add any Storybook addons you want here: https://storybook.js.org/addons/
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-a11y'
    ],

    typescript: {
        check: false,
        reactDocgen: false
    },

    webpackFinal: async (config) => {
        // Disable the Storybook internal-`.svg`-rule for components loaded from our app.
        const svgRule = config.module.rules.find((rule) =>
            'test.svg'.match(rule.test)
        );
        svgRule.exclude = [AppSourceDir];

        // Add custom storybook SVG loader
        config.module.rules.push({
            test: /\.svg$/i,
            include: [AppSourceDir],
            use: ['@svgr/webpack', 'file-loader']
        });

        config.module.rules.push({
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [postcssUrl({ url: 'inline' })]
                        }
                    }
                }
            ],
            include: path.resolve(__dirname, '../')
        });

        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: require.resolve('babel-loader'),
            options: {
                presets: [['react-app', { flow: false, typescript: true }]]
            }
        });

        config.resolve.extensions.push('.ts', '.tsx');

        config.plugins.push(
            new ESLintPlugin({
                extensions: ['js', 'ts', 'tsx'],
                files: 'src/**'
            })
        );

        return config;
    },

    framework: {
        name: '@storybook/react-webpack5',
        options: {}
    }
};
