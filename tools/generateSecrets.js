const fs = require('fs');
const placeholder = require('./../.storybook/secrets.placeholder.js');
const userDefined = require('./../.storybook/secrets.fromUser.js');

const secretsPath = `./.storybook/secrets.js`;

const mergedSecrets = {...placeholder, ...userDefined};
fs.writeFileSync(
    secretsPath,
    `export const AuthenticationParameters = ${JSON.stringify(mergedSecrets, null, 4)};`
);