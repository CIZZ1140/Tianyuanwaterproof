import sys
import boto3
from PIL import Image
import io
import requests

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

def download_optimize_upload(url, key):
    print(f"Processing {url} -> {key}...")
    try:
        response = requests.get(url)
        img = Image.open(io.BytesIO(response.content))
        
        # Convert to WebP
        buffer = io.BytesIO()
        img.save(buffer, format='WEBP', quality=85)
        buffer.seek(0)
        
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=key,
            Body=buffer,
            ContentType='image/webp'
        )
        print(f"Successfully uploaded {key}")
    except Exception as e:
        print(f"Failed {key}: {str(e)}")

if __name__ == "__main__":
    images = [
        ("https://s.alicdn.com/@sc04/kf/H341c3e2fdfd24f7993538edd69895497k/TIANYUAN-Traditional-Saturated-15lb-30lb-Waterproof-Organic.png_480x480.jpg", "products/organic-roofing-felt.webp"),
        ("https://sc04.alicdn.com/kf/H8d7ba0b4752c4c4ea051b0098d1e432cZ.jpg", "products/sbs-torch-applied-membrane.webp"),
        ("https://sc04.alicdn.com/kf/H3cb6c885126c48ab92a056637d9f1cd2x.jpg", "products/self-adhesive-color-steel-membrane.webp"),
        ("https://sc04.alicdn.com/kf/H7e087a70867f43a8bd7c11db0b7f9e20T.jpg", "categories/asphalt-shingles.webp"),
        ("https://sc01.alicdn.com/kf/Hdb438925582c4ac683687a185028b305u.png", "categories/waterproof-coatings.webp")
    ]
    
    for url, key in images:
        download_optimize_upload(url, key)
