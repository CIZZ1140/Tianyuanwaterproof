import boto3
import requests
from io import BytesIO
from PIL import Image
import os

# R2 Credentials
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

def convert_and_upload(jpg_url, webp_key):
    print(f"--- Processing {webp_key} ---")
    print(f"Downloading from {jpg_url}...")
    response = requests.get(jpg_url)
    if response.status_code != 200:
        print(f"Failed to download. Status: {response.status_code}")
        return

    # Convert to WebP
    print("Converting to WebP...")
    img = Image.open(BytesIO(response.content))
    output = BytesIO()
    img.save(output, format='WebP', quality=85)
    output.seek(0)

    # Upload to R2
    print(f"Uploading to R2 as {webp_key}...")
    s3.upload_fileobj(
        output,
        BUCKET_NAME,
        webp_key,
        ExtraArgs={'ContentType': 'image/webp'}
    )
    print("Upload successful!")

if __name__ == "__main__":
    targets = [
        {
            "src": "https://img.tyuanwaterproof.com/products/bitumen-membrane-surface.jpg",
            "key": "products/bitumen-membrane-surface.webp"
        },
        {
            "src": "https://img.tyuanwaterproof.com/products/sbs-membrane-material.jpg",
            "key": "products/sbs-membrane-material.webp"
        },
        {
            "src": "https://img.tyuanwaterproof.com/products/bitumen-membrane-loading.jpg",
            "key": "products/bitumen-membrane-loading.webp"
        }
    ]

    for t in targets:
        convert_and_upload(t['src'], t['key'])
