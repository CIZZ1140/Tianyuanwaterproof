import sys
import boto3
from rembg import remove
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import io
import requests
import numpy as np

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

def ultra_optimize_logo(url):
    print(f"Executing surgical refinement on logo from {url}...")
    response = requests.get(url)
    input_image = response.content
    
    # Remove black background accurately
    output_image = remove(input_image)
    img = Image.open(io.BytesIO(output_image)).convert("RGBA")
    
    # Tight crop
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    
    # Increase resolution for processing
    img = img.resize((img.width * 4, img.height * 4), Image.Resampling.LANCZOS)
    
    # Image manipulation to make text visible
    # We will detect red pixels and make them "Vivid Red" or "White" for better contrast
    data = np.array(img)
    r, g, b, a = data.T
    
    # Select reddish pixels (text and seal)
    red_areas = (r > 100) & (r > g * 1.5) & (r > b * 1.5)
    
    # Transform: Let's make the text elements brighter
    # To keep it professional, we'll boost the red significantly
    data[..., 0][red_areas.T] = 255 # Max Red
    data[..., 1][red_areas.T] = 200 # Add Green to make it bright orange-red (more visible)
    data[..., 2][red_areas.T] = 200 # Add Blue to make it lean towards white-ish red
    # Wait, simple white is best for B2B readability on dark blue.
    # Let's try making the outer characters WHITE while keeping the inner circle RED.
    
    # Refined logic: If pixel is far from center, it's the "Tian Fu Yuan" text -> make it white.
    center_x, center_y = data.shape[1] // 2, data.shape[0] // 2
    y, x = np.ogrid[:data.shape[0], :data.shape[1]]
    dist_from_center = np.sqrt((x - center_x)**2 + (y - center_y)**2)
    outer_threshold = data.shape[0] * 0.25 # Inner circle radius approx
    
    outer_text = (red_areas.T) & (dist_from_center > outer_threshold)
    data[..., 0][outer_text] = 255
    data[..., 1][outer_text] = 255
    data[..., 2][outer_text] = 255
    
    new_img = Image.fromarray(data)
    
    # Strong Sharpen
    new_img = new_img.filter(ImageFilter.SHARPEN)
    new_img = new_img.filter(ImageFilter.EDGE_ENHANCE_MORE)
    
    # Back to original target size but with high-quality downsampling
    target_height = 400
    ratio = target_height / new_img.height
    new_img = new_img.resize((int(new_img.width * ratio), target_height), Image.Resampling.LANCZOS)

    # Save to buffer
    buffer = io.BytesIO()
    new_img.save(buffer, format='PNG', optimize=True)
    buffer.seek(0)
    
    print("Uploading ULTRA-VISIBLE logo.png to R2...")
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key='logo.png',
        Body=buffer,
        ContentType='image/png'
    )
    print("Ultra-Visible Logo deployed.")

if __name__ == "__main__":
    logo_url = "https://sc02.alicdn.com/kf/H65e1b11dc9954fbbabedeff32ca254b9S.png"
    try:
        ultra_optimize_logo(logo_url)
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)
