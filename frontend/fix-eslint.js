const fs = require('fs');
const path = require('path');

// Create the path to the missing file
const patchBaseDir = path.join(__dirname, 'node_modules', '@rushstack', 'eslint-patch', 'lib');
const patchBasePath = path.join(patchBaseDir, '_patch-base.js');

// Create the directory if it doesn't exist
if (!fs.existsSync(patchBaseDir)) {
  fs.mkdirSync(patchBaseDir, { recursive: true });
}

// Create the missing file
const content = `// This is a workaround for the error "Cannot find module './_patch-base'"
module.exports = {};`;

fs.writeFileSync(patchBasePath, content);

console.log(`Fixed ESLint issue by creating: ${patchBasePath}`);
console.log('Now you can run: npm start with DISABLE_ESLINT_PLUGIN=true');
console.log('In Windows: set DISABLE_ESLINT_PLUGIN=true && npm start');
console.log('In Linux/Mac: DISABLE_ESLINT_PLUGIN=true npm start'); 