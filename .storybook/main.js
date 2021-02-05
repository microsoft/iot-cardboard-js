const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    stories: ['../src/**/*.stories.tsx'],
    // Add any Storybook addons you want here: https://storybook.js.org/addons/
    addons: ['@storybook/addon-essentials'],
    webpackFinal: async (config) => {
        config.module.rules.push({
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
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
