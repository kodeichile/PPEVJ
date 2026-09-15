import json, pathlib, re, html
src = pathlib.Path('work/landing_catalogo/Entre vinos y jardines.html').read_text(encoding='utf-8')
products = json.loads(re.search(r'const catalogProducts=(\[.*?\]);\s*\n\s*const defaultSiteSettings', src, re.S).group(1))[:4]
def money(value): return '${:,.0f}'.format(value).replace(',', '.')
cards=[]
for p in products:
    cards.append(f'''        <article class="product-card">
          <button class="favorite" aria-label="Agregar a favoritos">♡</button>
          <img src="catalogo-img/{p['id']}.gif" alt="{html.escape(p['name'])}">
          <div class="product-info">
            <span class="product-category">{html.escape(p['image'].split('/')[1])}</span>
            <h3>{html.escape(p['name'])}</h3>
            <p>{html.escape(p['description'])}</p>
            <strong>{money(p['price'])}</strong>
            <button class="add-cart">Agregar</button>
          </div>
        </article>''')
path=pathlib.Path('outputs/index.html')
text=path.read_text(encoding='utf-8-sig')
text=re.sub(r'(?s)<div class="product-grid">\s*<article class="product-card">.*?</div>\s*</section>\s*\n\s*<section class="section services-section"', '<div class="product-grid">\n'+'\n\n'.join(cards)+'\n      </div>\n    </section>\n\n    <section class="section services-section"', text, count=1)
path.write_text(text, encoding='utf-8')
print('destacados actualizados', [p['name'] for p in products])
