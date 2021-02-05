module.exports = {
    branches: [
        'release',
        { name: 'main', channel: 'beta', prerelease: 'beta' }
    ],
    repositoryUrl: 'https://github.com/microsoft/iot-cardboard-js.git',
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'conventionalcommits'
            }
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'conventionalcommits',
                presetConfig: {
                    types: [
                        { type: 'feat', section: 'Features' },
                        { type: 'fix', section: 'Bug Fixes' },
                        { type: 'perf', section: 'Performance Improvements' },
                        { type: 'chore', section: 'Miscellaneous' },
                        { type: 'docs', section: 'Documentation' },
                        { type: 'style', section: 'Styles' },
                        { type: 'refactor', section: 'Code refactoring' },
                        { type: 'test', section: 'Testing' }
                    ]
                }
            }
        ],
        ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
        '@semantic-release/npm',
        [
            '@semantic-release/github',
            {
                assets: {
                    path: './CHANGELOG.md',
                    label: 'Changelog for this release.'
                }
            }
        ]
    ]
};
