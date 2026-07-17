import boto3
import requests
from io import BytesIO
from PIL import Image

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

def upload_as_webp(url, r2_key):
    print(f"Downloading from {url}...")
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        # Convert to WebP
        img = Image.open(BytesIO(response.content))
        webp_buffer = BytesIO()
        img.save(webp_buffer, format="WEBP", quality=85)
        webp_buffer.seek(0)
        
        print(f"Uploading to R2 as {r2_key} (WebP)...")
        s3.upload_fileobj(
            webp_buffer,
            BUCKET_NAME,
            r2_key,
            ExtraArgs={'ContentType': 'image/webp'}
        )
        print("Upload successful!")
    else:
        print(f"Failed to download image. Status: {response.status_code}")

if __name__ == "__main__":
    target_url = "https://sc04.alicdn.com/kf/A9101beb355814deda9ca338d93ecdedef.jpg"
    target_key = "products/sbs-torch-membrane-main.webp"
    upload_as_webp(target_url, target_key)
