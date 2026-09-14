const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8');
content = content.replace(/const sign = isPositive \? ["'].*?["'] \: ["'].*?["'];/g, 'const sign = isPositive ? "\\u25B2" : "\\u25BC";');
fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf-8');
