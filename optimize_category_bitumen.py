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

def process_and_upload_category_image(url, key):
    print(f"Downloading image from {url}...")
    response = requests.get(url)
    img = Image.open(io.BytesIO(response.content))
    
    # Target 16:9 aspect ratio
    target_ratio = 16/9
    current_ratio = img.width / img.height
    
    if current_ratio > target_ratio:
        # Too wide, crop sides
        new_width = int(img.height * target_ratio)
        offset = (img.width - new_width) // 2
        img = img.crop((offset, 0, offset + new_width, img.height))
    elif current_ratio < target_ratio:
        # Too tall, crop top/bottom
        new_height = int(img.width / target_ratio)
        offset = (img.height - new_height) // 2
        img = img.crop((0, offset, img.width, offset + new_height))
    
    # Resize to 800px width
    new_size = (800, 450)
    img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Save as WebP
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
    # URL of the torch-applied bitumen membrane image
    image_url = "https://sc04.alicdn.com/kf/H23ccfaa20ce34ef3ab8df62bdbd774d2p.jpg"
    target_key = "cat-bitumen-membranes.webp"
    
    try:
        process_and_upload_category_image(image_url, target_key)
        print(f"SUCCESS: Image uploaded to img.tyuanwaterproof.com/{target_key}")
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)
