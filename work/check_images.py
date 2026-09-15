from pathlib import Path
import re, html
missing=[]
for f in Path('outputs').glob('*.html'):
    s=f.read_text(encoding='utf-8-sig')
    for src in re.findall(r'<img[^>]+src="([^"]+)"', s):
        if not src.startswith('http') and not (Path('outputs')/html.unescape(src)).exists():
            missing.append((str(f), src))
print('missing count:', len(missing))
for item in missing[:20]: print(item)
