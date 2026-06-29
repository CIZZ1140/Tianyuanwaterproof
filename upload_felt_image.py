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

def process_and_upload(url, key):
    print(f"Processing {url} -> {key}")
    response = requests.get(url)
    img = Image.open(io.BytesIO(response.content))
    
    # Convert to WebP and optimize
    buffer = io.BytesIO()
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    
    # High quality optimization
    img.save(buffer, format='WEBP', quality=85, method=6)
    buffer.seek(0)
    
    print(f"Uploading to R2: {key}")
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=key,
        Body=buffer,
        ContentType='image/webp'
    )
    print(f"Success: {key}")

if __name__ == "__main__":
    asset_url = "https://sc02.alicdn.com/kf/S2a1df6cb4e714964b8e9b1a8874691e60.png"
    asset_key = "products/asphalt-felt.webp"
    
    try:
        process_and_upload(asset_url, asset_key)
    except Exception as e:
        print(f"Failed to process image: {e}")
