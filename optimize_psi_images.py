"""PSI Image Optimization Script
Resizes images flagged by PageSpeed Insights to match display dimensions,
then re-uploads to Cloudflare R2.
"""
import sys
import boto3
from PIL import Image
import io
import requests

ACCESS_KEY_ID = 'ce5b6b26ab1966a604a3aca26c3b7027'
SECRET_ACCESS_KEY = '067f6bf0c272c3178b8ade6fa5f747496e403634d873bfe54901398da1076f00'
ACCOUNT_ID = 'e9959091b1e482fe98459040387c9daf'
BUCKET_NAME = 'tianyuan'
ENDPOINT_URL = f'https://{ACCOUNT_ID}.r2.cloudflarestorage.com'

s3 = boto3.client(
    service_name='s3',
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=ACCESS_KEY_ID,
    aws_secret_access_key=SECRET_ACCESS_KEY,
    region_name='auto'
)

# Images flagged by PSI: (r2_key, target_width, target_height, description)
IMAGES = [
    ("products/hdpe-geomembrane-liner-roll.webp", 592, 592, "HDPE Geomembrane"),
    ("cat-asphalt-shingles.webp", 592, 333, "Asphalt Shingles"),
    ("cat-bitumen-membranes.webp", 592, 333, "Bitumen Membranes"),
    ("cat-waterproof-coatings-v2.webp", 592, 333, "Waterproof Coatings"),
    ("cat-waterproof-tapes-v2.webp", 592, 333, "Waterproof Tapes"),
    ("cat-polymer-membranes.webp", 592, 333, "Polymer Membranes"),
]

CDN_BASE = "https://img.tyuanwaterproof.com"


def resize_and_upload(key, target_w, target_h, label):
    url = f"{CDN_BASE}/{key}"
    print(f"[{label}] Downloading {url}...")
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()

    img = Image.open(io.BytesIO(resp.content))
    original_size = len(resp.content)
    print(f"  Original: {img.width}x{img.height} | {original_size / 1024:.1f} KiB")

    # Only resize if current dims exceed target
    if img.width <= target_w and img.height <= target_h:
        print(f"  Already within target {target_w}x{target_h}, skipping.")
        return

    # Maintain aspect ratio: fit within target box
    img.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)
    print(f"  Resized to {img.width}x{img.height}")

    # If original was WebP, keep format; otherwise convert
    fmt = "WEBP" if key.endswith(".webp") else "JPEG"
    save_kw = {"format": fmt}
    if fmt == "WEBP":
        save_kw["quality"] = 80
    elif fmt == "JPEG":
        save_kw["quality"] = 82

    buffer = io.BytesIO()
    img.save(buffer, **save_kw)
    buffer.seek(0)
    new_size = buffer.getbuffer().nbytes
    print(f"  New size: {new_size / 1024:.1f} KiB (saved {(original_size - new_size) / 1024:.1f} KiB)")

    print(f"  Uploading to R2: {key}")
    content_type = f"image/{fmt.lower()}"
    s3.put_object(Bucket=BUCKET_NAME, Key=key, Body=buffer, ContentType=content_type)
    print(f"  Done.")


if __name__ == "__main__":
    print("=" * 50)
    print("PSI Image Optimization Script")
    print(f"Target: {CDN_BASE}")
    print("=" * 50)

    errors = []
    for key, w, h, label in IMAGES:
        print()
        try:
            resize_and_upload(key, w, h, label)
        except Exception as e:
            msg = f"  ERROR [{label}]: {e}"
            print(msg)
            errors.append((key, str(e)))

    print()
    print("=" * 50)
    if errors:
        print(f"Completed with {len(errors)} error(s):")
        for k, err in errors:
            print(f"  - {k}: {err}")
        sys.exit(1)
    else:
        total_savings = "Images resized to match PSI display dimensions"
        print(f"All {len(IMAGES)} images processed successfully.")
        print("Remember to clear Cloudflare CDN cache for img.tyuanwaterproof.com")
    print("=" * 50)
