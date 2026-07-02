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

def process_and_upload(url, r2_key):
    print(f"Downloading image: {url}...")
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to download. Status: {response.status_code}")
        return

    img = Image.open(BytesIO(response.content))
    
    # 16:9 Resize
    width = 800
    height = int(width * 9 / 16)
    img = img.resize((width, height), Image.Resampling.LANCZOS)
    
    webp_io = BytesIO()
    img.save(webp_io, format='WEBP', quality=85)
    webp_io.seek(0)
    
    print(f"Uploading to R2: {r2_key}...")
    s3.upload_fileobj(
        webp_io,
        BUCKET_NAME,
        r2_key,
        ExtraArgs={'ContentType': 'image/webp'}
    )
    print(f"Successfully uploaded to https://img.tyuanwaterproof.com/{r2_key}")

if __name__ == "__main__":
    target_url = "https://sc04.alicdn.com/kf/H43738b4f93944c1c8de7561ddf5cda4dh.jpg"
    target_key = "cat-waterproof-tapes-v2.webp"
    process_and_upload(target_url, target_key)
