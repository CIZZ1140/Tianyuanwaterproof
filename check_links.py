import requests, re
r = requests.get("https://www.tyuanwaterproof.com/")
html = r.text
links = re.findall(r"href=[\"'](/[^\"']*|https://www\.tyuanwaterproof\.com[^\"']*)[\"']", html)
print(f"Total internal links: {len(links)}")
for l in sorted(set(links))[:30]:
    print(f"  {l[:80]}")
if len(set(links)) > 30:
    print(f"  ... and {len(set(links))-30} more unique links")
