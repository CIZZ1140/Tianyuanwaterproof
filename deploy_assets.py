import sys
import boto3
from rembg import remove
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

def process_and_upload_logo(url):
    print(f"Downloading logo from {url}...")
    response = requests.get(url)
    input_image = response.content
    
    print("Removing background...")
    # rembg to remove black background
    output_image = remove(input_image)
    
    img = Image.open(io.BytesIO(output_image))
    
    # Trim empty space around logo
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    
    # Resize to a reasonable web size (height 400px max)
    max_height = 400
    if img.height > max_height:
        ratio = max_height / img.height
        new_size = (int(img.width * ratio), max_height)
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Save to buffer as optimized PNG (for transparency)
    buffer = io.BytesIO()
    img.save(buffer, format='PNG', optimize=True)
    buffer.seek(0)
    
    print("Uploading logo.png to R2...")
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key='logo.png',
        Body=buffer,
        ContentType='image/png'
    )
    print("Logo uploaded successfully.")

def process_and_upload_banner(url):
    print(f"Downloading banner from {url}...")
    response = requests.get(url)
    img = Image.open(io.BytesIO(response.content))
    
    # Convert to WebP for best performance
    buffer = io.BytesIO()
    img.save(buffer, format='WEBP', quality=85)
    buffer.seek(0)
    
    print("Uploading banner.webp to R2...")
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key='banner.webp',
        Body=buffer,
        ContentType='image/webp'
    )
    print("Banner uploaded successfully.")

if __name__ == "__main__":
    logo_url = "https://sc02.alicdn.com/kf/H65e1b11dc9954fbbabedeff32ca254b9S.png"
    banner_url = "https://sc02.alicdn.com/kf/Hadfc00d5fae94dc0bc12037c70917cf1h.png"
    
    try:
        process_and_upload_logo(logo_url)
        process_and_upload_banner(banner_url)
        print("ALL ASSETS DEPLOYED TO CLOUDFLARE R2.")
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)
