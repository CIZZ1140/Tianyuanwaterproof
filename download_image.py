import requests
import os

url = "https://sc04.alicdn.com/kf/S4bc13b75454f4362bbc9567aca3c4899V.jpg"
output_dir = "public/img/blog"
output_path = os.path.join(output_dir, "2026-market-report-cover.jpg")

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

print(f"Downloading {url} to {output_path}...")
response = requests.get(url)
if response.status_code == 200:
    with open(output_path, "wb") as f:
        f.write(response.content)
    print("Download successful!")
else:
    print(f"Failed to download. Status: {response.status_code}")
