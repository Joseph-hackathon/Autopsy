const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8');
content = content.replace('64x64/3168.png', '64x64/4195.png'); // Revert FTT
content = content.replace('64x64/20314.png', '64x64/4172.png'); // Revert LUNA
fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf-8');
