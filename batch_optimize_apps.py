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
    print(f"Processing {r2_key}...")
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to download {url}")
        return

    img = Image.open(BytesIO(response.content))
    
    # Resize to 4:3 (600x450)
    target_width = 600
    target_height = 450
    
    # Calculate crop
    img_ratio = img.width / img.height
    target_ratio = target_width / target_height
    
    if img_ratio > target_ratio:
        # Image is wider than 4:3, crop width
        new_width = int(target_ratio * img.height)
        offset = (img.width - new_width) // 2
        img = img.crop((offset, 0, offset + new_width, img.height))
    else:
        # Image is taller than 4:3, crop height
        new_height = int(img.width / target_ratio)
        offset = (img.height - new_height) // 2
        img = img.crop((0, offset, img.width, offset + new_height))
    
    img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    webp_io = BytesIO()
    img.save(webp_io, format='WEBP', quality=82)
    webp_io.seek(0)
    
    s3.upload_fileobj(
        webp_io,
        BUCKET_NAME,
        r2_key,
        ExtraArgs={'ContentType': 'image/webp'}
    )
    print(f"Uploaded to https://img.tyuanwaterproof.com/{r2_key}")

if __name__ == "__main__":
    tasks = [
        ("https://sc04.alicdn.com/kf/H69d502a361224cdcb2e7adb5b2be9a4fH.jpg", "app-bridge-infrastructure.webp"),
        ("https://sc04.alicdn.com/kf/H209b779f266942c18054bb0632b2d048I.jpg", "app-joint-detail-sealing.webp"),
        ("https://sc04.alicdn.com/kf/H75863f122c474953b47ab7c3d4f764499.jpg", "app-industrial-building.webp")
    ]
    for url, key in tasks:
        process_and_upload(url, key)
