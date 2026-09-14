const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8');

const oldBtn1 = 'className="px-4 py-2 text-xs font-bold text-[#ececec] bg-[var(--color-winter-bg)] border border-[#333333] rounded hover:border-[var(--color-winter-green)] transition-colors uppercase font-blender"';
const newBtn1 = 'className="px-6 py-2.5 text-xs font-bold text-black bg-[var(--color-winter-green)] hover:opacity-80 transition-opacity uppercase font-blender rounded flex items-center gap-2"';

content = content.replace(oldBtn1, newBtn1);
// Also change the second button to be a secondary button but with matching styles
content = content.replace(oldBtn1, 'className="px-6 py-2.5 text-xs font-bold text-[#ececec] bg-transparent border border-[var(--color-winter-green)] hover:bg-[var(--color-winter-green)] hover:text-black transition-colors uppercase font-blender rounded"');

// Fix the "Explore" style by adding the arrow SVG to the first button
content = content.replace('>Filter: High Risk</button>', '>Filter: High Risk <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></button>');

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf-8');
