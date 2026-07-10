import requests, time

urls = [
    ("https://www.tyuanwaterproof.com/images/banner-mobile.webp", "banner-mobile (main domain)"),
    ("https://www.tyuanwaterproof.com/", "homepage HTML"),
    ("https://img.tyuanwaterproof.com/banner-mobile.webp", "banner-mobile (R2 CDN)"),
]

for url, label in urls:
    start = time.time()
    try:
        r = requests.get(url, headers={"Accept": "image/webp,text/html"}, timeout=15)
        elapsed = (time.time() - start) * 1000
        print(f"[{label}]")
        print(f"  Status: {r.status_code}")
        print(f"  Size: {len(r.content)/1024:.1f} KiB")
        print(f"  TTFB/Total: {elapsed:.0f} ms")
        print(f"  Cache: {r.headers.get('cf-cache-status','?')}")
        print(f"  CDN: {r.headers.get('server','?')}")
        print()
    except Exception as e:
        print(f"[{label}] ERROR: {e}\n")
