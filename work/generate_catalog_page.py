import json, pathlib, re, shutil, html
src = pathlib.Path('work/landing_catalogo/Entre vinos y jardines.html')
text = src.read_text(encoding='utf-8')
match = re.search(r'const catalogProducts=(\[.*?\]);\s*\n\s*const defaultSiteSettings', text, re.S)
if not match:
    raise SystemExit('No catalogProducts found')
products = json.loads(match.group(1))
out_img = pathlib.Path('outputs/catalogo-img')
out_img.mkdir(parents=True, exist_ok=True)
base = pathlib.Path('work/landing_catalogo')
for p in products:
    original = base / p['image']
    suffix = original.suffix or '.gif'
    clean = f"{p['id']}{suffix.lower()}"
    target = out_img / clean
    if original.exists():
        shutil.copy2(original, target)
        p['localImage'] = f"catalogo-img/{clean}"
    else:
        p['localImage'] = p['image']

def money(value):
    return '${:,.0f}'.format(value).replace(',', '.')
filters = []
for p in products:
    folder = p['image'].split('/')[1] if '/' in p['image'] else p['category']
    if folder not in filters:
        filters.append(folder)
buttons = ['        <button class="filter-button active" data-filter="todos">Todos</button>'] + [f'        <button class="filter-button" data-filter="{html.escape(f)}">{html.escape(f)}</button>' for f in filters]
cards = []
for p in products:
    folder = p['image'].split('/')[1] if '/' in p['image'] else p['category']
    cards.append(f'''          <article class="product-card catalog-item" data-category="{html.escape(folder)}" data-name="{html.escape((p['name']+' '+p['shortName']).lower())}">
            <button class="favorite" aria-label="Agregar a favoritos">♡</button>
            <img src="{html.escape(p['localImage'])}" alt="{html.escape(p['name'])}">
            <div class="product-info"><span class="product-category">{html.escape(folder)}</span><h3>{html.escape(p['name'])}</h3><p>{html.escape(p['description'])}</p><strong>{money(p['price'])}</strong><button class="add-cart">Agregar</button></div>
          </article>''')
html_doc = f'''<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Productos | Entre Vinos y Jardines</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <div class="topbar"><span>Envios a todo Chile</span><span>Asesoria especializada</span><span>Calidad garantizada</span><span class="social">Siguenos</span></div>
    <nav class="navbar" aria-label="Principal">
      <a class="brand" href="index.html"><span class="brand-mark">EV</span><span><strong>Entre Vinos y Jardines</strong><small>Catalogo verde</small></span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span></span><span></span><span></span></button>
      <div class="menu" id="main-menu">
        <a href="index.html">Inicio</a><a class="active" href="productos.html">Productos</a><a href="servicios.html">Servicios</a><a href="asesorias.html">Asesoria</a><a href="nosotros.html">Nosotros</a><a href="contacto.html">Contacto</a>
      </div>
      <div class="nav-actions"><button class="icon-button" aria-label="Buscar">⌕</button><button class="icon-button" aria-label="Cuenta">♙</button><button class="cart-button" aria-label="Carrito de compras">🛒<span id="cart-count">2</span></button><a class="whatsapp" href="https://wa.me/56996890211">WhatsApp</a></div>
    </nav>
  </header>

  <main>
    <section class="page-hero compact-hero">
      <div>
        <p class="eyebrow">Catalogo publico</p>
        <h1>Vivero Entre Vinos y Jardines</h1>
        <p>Catalogo completo actualizado a julio de 2026. Selecciona plantas, arma tu pedido y cotiza gratis por WhatsApp.</p>
      </div>
    </section>

    <section class="catalog-layout">
      <aside class="filters" aria-label="Filtros de productos">
        <h2>Filtrar</h2>
{chr(10).join(buttons)}
      </aside>

      <section class="catalog-content" aria-label="Listado de productos">
        <div class="catalog-toolbar">
          <h2>{len(products)} productos disponibles</h2>
          <input id="product-search" type="search" placeholder="Buscar producto" aria-label="Buscar producto">
        </div>

        <div class="product-grid catalog-grid">
{chr(10).join(cards)}
        </div>
      </section>
    </section>
  </main>

  <footer class="footer" id="contacto">
    <div class="footer-grid">
      <div><a class="brand footer-brand" href="index.html"><span class="brand-mark">EV</span><span><strong>Entre Vinos y Jardines</strong><small>Catalogo verde</small></span></a><p>Plantas de vivero, frutales, arbustos y ornamentales para jardines y terrazas.</p></div>
      <div><h3>Productos</h3><a href="productos.html">Frutales</a><a href="productos.html">Arbustos</a><a href="productos.html">Arboles ornamentales</a></div>
      <div><h3>Servicios</h3><a href="servicios.html">Diseno de jardines</a><a href="servicios.html">Construccion</a><a href="servicios.html">Mantencion</a><a href="servicios.html">Riego</a></div>
      <div><h3>Contacto</h3><p>+56 9 9689 0211</p><p>contacto@entrevinosyjardines.cl</p><p>Cotizaciones por WhatsApp</p></div>
    </div>
    <p class="copyright">© 2026 Entre Vinos y Jardines. Todos los derechos reservados.</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>
'''
pathlib.Path('outputs/productos.html').write_text(html_doc, encoding='utf-8')
print(len(products), 'productos generados')
print(filters)
