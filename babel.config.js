module.exports = {
    presets: ['@babel/preset-env', '@griffel'],
    plugins: [
        [
            '@babel/plugin-transform-runtime',
            {
                regenerator: true
            }
        ],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-private-methods'
    ]
};
