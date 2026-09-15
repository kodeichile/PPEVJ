import json, pathlib, re
src=pathlib.Path('work/landing_catalogo/Entre vinos y jardines.html').read_text(encoding='utf-8')
products=json.loads(re.search(r'const catalogProducts=(\[.*?\]);\s*\n\s*const defaultSiteSettings', src, re.S).group(1))
for p in products:
    p['imagen_url']='/catalogo-img/'+p['id']+'.gif'
    p['nombre']=p.pop('name')
    p['descripcion']=p.pop('description')
    p['precio']=p.pop('price')
    p['activo']=p.pop('visible')
    p.pop('image',None); p.pop('buttonText',None); p.pop('available',None); p.pop('featured',None); p.pop('shortName',None); p.pop('category',None); p.pop('order',None)
content='export type Product = { id: string; nombre: string; precio: number; imagen_url: string; descripcion: string; activo: boolean; fecha_creacion?: string };\n\n'
content+='export const fallbackProducts: Product[] = '+json.dumps(products, ensure_ascii=False, indent=2)+';\n'
pathlib.Path('lib/fallback-products.ts').write_text(content, encoding='utf-8')
print(len(products))
