const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const postcssUrl = require('postcss-url');
module.exports = {
    stories:
        process.env.NODE_ENV === 'production'
            ? ['../src/**/*.stories.tsx']
            : ['../src/**/*.stories.tsx', '../src/**/*.stories.local.tsx'],
    // Add any Storybook addons you want here: https://storybook.js.org/addons/
    addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
    webpackFinal: async (config) => {
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
    }
};
