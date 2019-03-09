const fs = require('fs');

const dist = './dist';
const output = 'style.css';

const files = fs
  .readdirSync(dist)
  .filter(file => /\.css$/.test(file))
  .filter(file => file !== output)
  .map(file => `@import '${file}';`)
  .join('\n');

fs.writeFileSync(`${dist}/${output}`, files);
