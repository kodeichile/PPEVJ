import urllib.request, json, pathlib, re
base=pathlib.Path('work/repo_docs')
base.mkdir(parents=True, exist_ok=True)
headers={'User-Agent':'codex'}

def get(url):
    req=urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()
items=json.loads(get('https://api.github.com/repos/kodeichile/Pwad/contents/docs?ref=main'))
for item in items:
    print(item['name'], item['type'], item.get('size'))
    if item['type']=='file' and item.get('download_url'):
        data=get(item['download_url'])
        (base/item['name']).write_bytes(data)
# js dir
jsitems=json.loads(get('https://api.github.com/repos/kodeichile/Pwad/contents/docs/js?ref=main'))
(base/'js').mkdir(exist_ok=True)
for item in jsitems:
    print('js/', item['name'], item['type'], item.get('size'))
    if item['type']=='file' and item.get('download_url'):
        (base/'js'/item['name']).write_bytes(get(item['download_url']))
