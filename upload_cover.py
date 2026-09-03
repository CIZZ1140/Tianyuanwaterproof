import boto3
import requests
from io import BytesIO

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

def upload_from_url(url, r2_key):
    print(f"Downloading from {url}...")
    response = requests.get(url)
    if response.status_code == 200:
        print(f"Uploading to R2 as {r2_key}...")
        s3.upload_fileobj(
            BytesIO(response.content),
            BUCKET_NAME,
            r2_key,
            ExtraArgs={'ContentType': 'image/jpeg'}
        )
        print("Upload successful!")
    else:
        print(f"Failed to download image. Status: {response.status_code}")

if __name__ == "__main__":
    target_url = "https://sc04.alicdn.com/kf/S4bc13b75454f4362bbc9567aca3c4899V.jpg"
    target_key = "blog/2026-market-report-cover.jpg"
    upload_from_url(target_url, target_key)
