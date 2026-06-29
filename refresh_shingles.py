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
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    buffer = io.BytesIO()
    img.save(buffer, format='WEBP', quality=85, method=6)
    buffer.seek(0)
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=key,
        Body=buffer,
        ContentType='image/webp'
    )
    print(f"Success: {key}")

if __name__ == "__main__":
    # Re-uploading shingles to refresh permissions
    assets = [
        ("https://sc02.alicdn.com/kf/Hce4cf28b7ea546d89619f925b6a2704aa.jpg", "products/asphalt-shingles-3-tab.webp"),
        ("https://sc02.alicdn.com/kf/Hbfca3fc854e84bd2a172c202155386e55.jpg", "products/asphalt-shingles-artistic.webp"),
        ("https://sc02.alicdn.com/kf/H67967cda5b24449f8f3621ffbf857aabI.jpg", "products/asphalt-shingles-laminated.webp")
    ]
    
    for url, key in assets:
        try:
            process_and_upload(url, key)
        except Exception as e:
            print(f"Failed to process {url}: {e}")
