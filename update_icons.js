const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8');
content = content.replace('64x64/8782.png', '64x64/32544.png');
content = content.replace('64x64/4195.png', '64x64/3168.png');
content = content.replace('64x64/4172.png', '64x64/20314.png');
fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf-8');
