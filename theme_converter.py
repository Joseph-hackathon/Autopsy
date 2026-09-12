import re

def update_theme():
    path = r"C:\Users\PC_1M\.gemini\antigravity\scratch\crypto-autopsy\frontend\src\app\page.tsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Colors
    content = content.replace("cyan-500", "[var(--color-spark-teal)]")
    content = content.replace("cyan-400", "[var(--color-spark-teal)]")
    content = content.replace("cyan-900", "teal-900")
    content = content.replace("cyan-950", "teal-950")
    content = content.replace("cyan-800", "teal-800")
    content = content.replace("rose-500", "[var(--color-spark-magenta)]")
    content = content.replace("rose-400", "[var(--color-spark-magenta)]")
    content = content.replace("rose-900", "fuchsia-900")
    content = content.replace("rose-950", "fuchsia-950")
    
    # Fonts
    content = content.replace("font-mono", "font-sans font-medium")
    
    # Header
    content = content.replace('bg-[#0A0A0A]/80', 'bg-transparent')
    content = content.replace('border-b border-zinc-800/80', '')
    
    # Search input
    content = re.sub(r'bg-zinc-900/80 border border-zinc-800(.*? rounded-lg)', r'glass-pill\1', content)
    
    # Overview container
    content = content.replace('bg-zinc-950 border border-zinc-800/80', 'glass-card border-none')
    content = content.replace('bg-zinc-950 border border-zinc-800 rounded-2xl', 'glass-card rounded-3xl')
    
    # Tabs
    content = content.replace('bg-teal-950 border border-teal-900/50 text-[var(--color-spark-teal)] shadow-inner', 'glass-pill text-white border border-white/20')
    content = content.replace('bg-zinc-800 text-zinc-300 hover:bg-zinc-700', 'text-zinc-400 hover:text-white bg-transparent')
    
    # Evidence Cards
    content = content.replace('bg-zinc-900/80 border rounded-xl', 'glass-card rounded-3xl')
    content = content.replace('bg-zinc-800/80 border border-zinc-700 rounded', 'glass-pill rounded-full')
    content = content.replace('bg-zinc-900 border border-zinc-700', 'glass-pill')
    
    # Doctor terminal
    content = content.replace('glass-panel rounded-2xl flex flex-col h-[600px] border border-teal-900/40', 'glass-card flex flex-col h-[600px]')
    content = content.replace('bg-zinc-950/80 backdrop-blur-md relative z-10', 'bg-transparent backdrop-blur-xl relative z-10')
    content = content.replace('bg-zinc-900 border border-zinc-700 text-zinc-300', 'glass-pill text-zinc-200')
    content = content.replace('bg-teal-900/40 border border-teal-800/50 text-[var(--color-spark-teal)]', 'bg-white/10 text-white glass-pill')
    content = content.replace('bg-zinc-950/50 border border-zinc-800/50', 'glass-pill')
    
    # General tweaks
    content = content.replace('animate-scanline', 'hidden')
    content = content.replace('animate-radar', 'hidden')
    
    # Button
    content = content.replace('bg-teal-950 hover:bg-teal-900 border border-teal-800', 'glass-pill hover:bg-white/10')
    content = content.replace('absolute right-1.5 top-1.5 bottom-1.5 bg-zinc-800 hover:bg-zinc-700', 'absolute right-1.5 top-1.5 bottom-1.5 glass-pill hover:bg-white/10')
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update_theme()
