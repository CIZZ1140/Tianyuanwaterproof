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

def process_and_upload_factory_image(url, key):
    print(f"Downloading image from {url}...")
    response = requests.get(url)
    img = Image.open(io.BytesIO(response.content))
    
    # Resize to max 1200px width for factory display
    if img.width > 1200:
        ratio = 1200 / img.width
        new_size = (1200, int(img.height * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Save as WebP with 85% quality
    buffer = io.BytesIO()
    img.save(buffer, format='WEBP', quality=85)
    buffer.seek(0)
    
    print(f"Uploading {key} to R2...")
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=key,
        Body=buffer,
        ContentType='image/webp'
    )
    print(f"{key} uploaded successfully.")

if __name__ == "__main__":
    image_url = "https://sc04.alicdn.com/kf/He6d09d415ec241b5a3c31d0b3697ecaaw.jpg"
    target_key = "factory-main.webp"
    
    try:
        process_and_upload_factory_image(image_url, target_key)
        print(f"SUCCESS: Image uploaded to img.tyuanwaterproof.com/{target_key}")
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)
