const fs = require('fs');

function replaceInFile(file, replacements) {
    let content = fs.readFileSync(file, 'utf-8');
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(file, content, 'utf-8');
}

// 1. Update globals.css
replaceInFile('frontend/src/app/globals.css', [
    [/--color-spark-teal: #00c49a;/g, '--color-winter-green: #00ff66;\n  --color-winter-bg: #1c1d1c;\n  --color-winter-card: #252725;'],
    [/--color-spark-magenta: #b026ff;/g, '--color-winter-purple: #9d8df1;'],
    [/background-color: #030303;/g, 'background-color: var(--color-winter-bg);'],
    [/rgba\(0, 196, 154/g, 'rgba(0, 255, 102'],
    [/var\(--color-spark-teal\)/g, 'var(--color-winter-green)'],
    [/linear-gradient\(rgba\(0, 255, 128, 0\.03\)/g, 'linear-gradient(rgba(0, 255, 102, 0.02)'],
    [/background: #000;/g, 'background: var(--color-winter-bg);']
]);

// 2. Update page.tsx
replaceInFile('frontend/src/app/page.tsx', [
    [/var\(--color-spark-teal\)/g, 'var(--color-winter-green)'],
    [/var\(--color-spark-magenta\)/g, 'var(--color-winter-purple)'],
    [/bg-black/g, 'bg-[var(--color-winter-bg)]'],
    [/bg-zinc-900\/50/g, 'bg-[var(--color-winter-card)]'],
    [/bg-zinc-950\/50/g, 'bg-[var(--color-winter-bg)]'],
    [/bg-zinc-900\/40/g, 'bg-[var(--color-winter-bg)]'],
    [/bg-zinc-800\/50/g, 'bg-[var(--color-winter-card)]'],
    [/bg-zinc-900\/60/g, 'bg-[var(--color-winter-card)]'],
    [/bg-transparent/g, 'bg-transparent'],
    [/bg-zinc-900/g, 'bg-[var(--color-winter-card)]'],
    [/border-white\/10/g, 'border-[#333333]'],
    [/border-white\/5/g, 'border-[#333333]'],
    [/hover:bg-white\/5/g, 'hover:bg-[#333333]'],
    // Add chamfered corners to the top header and filter buttons
    [/className="px-4 py-2 text-xs font-bold text-\[\#ececec\] bg-black border border-white\/10 rounded hover:border-\[var\(--color-spark-teal\)\] transition-colors uppercase font-blender"/g, 'className="px-6 py-2.5 text-xs font-bold text-black bg-[var(--color-winter-green)] hover:opacity-80 transition-opacity uppercase font-blender rounded-sm"']
]);

// 3. Update CanvasStat.tsx
replaceInFile('frontend/src/components/CanvasStat.tsx', [
    [/#00c49a/g, '#00ff66']
]);

// 4. Update BackgroundEffects.tsx
replaceInFile('frontend/src/components/BackgroundEffects.tsx', [
    [/#030303/g, '#1c1d1c'],
    [/0, 196, 154/g, '0, 255, 102'],
    [/176, 38, 255/g, '157, 141, 241']
]);

console.log('Colors replaced successfully.');
