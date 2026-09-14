const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8');

// Replace glass-panel with dark minimalist border
content = content.replace(/className="glass-panel rounded-2xl p-6 relative overflow-hidden group"/g, 'className="border border-white/10 rounded-none p-6 relative overflow-hidden group bg-black"');

// Replace glow
content = content.replace(/className={\bsolute top-0 right-0 w-\[500px\] h-\[500px\] rounded-full blur-\[120px\].*?\}<\/div>/g, '');

// Replace logo wrapper
content = content.replace(/className="w-20 h-20 rounded-2xl glass-pill flex items-center justify-center p-2 shadow-xl relative"/g, 'className="w-20 h-20 flex items-center justify-center p-2 border border-white/10 bg-transparent relative grayscale opacity-90"');

// Replace rounded-full on logo
content = content.replace(/className="w-full h-full object-contain drop-shadow-lg rounded-full"/g, 'className="w-full h-full object-contain"');

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf-8');
