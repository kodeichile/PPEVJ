import urllib.request, json, pathlib, urllib.parse
base=pathlib.Path('work/landing_catalogo')
base.mkdir(parents=True, exist_ok=True)
headers={'User-Agent':'codex'}
def get(url):
    safe=urllib.parse.quote(url, safe=':/?&=%')
    req=urllib.request.Request(safe, headers=headers)
    with urllib.request.urlopen(req, timeout=90) as r:
        return r.read()
def fetch_dir(api_url, out):
    out.mkdir(parents=True, exist_ok=True)
    items=json.loads(get(api_url))
    for item in items:
        print(item['path'], item['type'], item.get('size'))
        if item['type']=='dir':
            fetch_dir(item['url'], out/item['name'])
        elif item.get('download_url'):
            target=out/item['name']
            if not target.exists() or target.stat().st_size != item.get('size'):
                target.write_bytes(get(item['download_url']))
fetch_dir('https://api.github.com/repos/kodeichile/Landing-page/contents/catalogo?ref=main', base)
