const fs = require('fs');

const theme = 'dist/themes.css';
const dest = 'dist/cardboard.css';

// Read themes files
const themeContents = fs.readFileSync(theme, 'utf-8');

// Append theme contents to cardboard styles
fs.appendFileSync(dest, themeContents);
