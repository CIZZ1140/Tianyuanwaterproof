import sys
import boto3
from rembg import remove
from PIL import Image, ImageEnhance, ImageFilter
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

def optimize_logo_v2(url):
    print(f"Refining logo from {url}...")
    response = requests.get(url)
    input_image = response.content
    
    # Remove background
    output_image = remove(input_image)
    img = Image.open(io.BytesIO(output_image)).convert("RGBA")
    
    # Tight crop
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    
    # Enhance Color (Make it pop on dark background)
    converter = ImageEnhance.Color(img)
    img = converter.enhance(1.5) # Boost saturation
    
    # Sharpen to maintain thin lines
    img = img.filter(ImageFilter.SHARPEN)
    
    # Save to buffer
    buffer = io.BytesIO()
    img.save(buffer, format='PNG', optimize=True)
    buffer.seek(0)
    
    print("Uploading REFINED logo.png to R2...")
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key='logo.png',
        Body=buffer,
        ContentType='image/png'
    )
    print("Refined Logo deployed.")

if __name__ == "__main__":
    logo_url = "https://sc02.alicdn.com/kf/H65e1b11dc9954fbbabedeff32ca254b9S.png"
    try:
        optimize_logo_v2(logo_url)
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)
