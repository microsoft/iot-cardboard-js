const fs = require('fs');
const placeholder = require('./../.storybook/secrets.placeholder.js');

const secretsPath = `./.storybook/secrets.js`;
fs.writeFileSync(
    secretsPath,
    `export const AuthenticationParameters = ${JSON.stringify(placeholder, null, 4)};`
);
