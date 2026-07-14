import boto3
import sys
import os
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

def upload_local_file(file_path, r2_key):
    print(f"Uploading {file_path} to R2 as {r2_key}...")
    try:
        content_type = 'image/png' if file_path.endswith('.png') else 'image/jpeg'
        with open(file_path, "rb") as f:
            s3.upload_fileobj(
                f,
                BUCKET_NAME,
                r2_key,
                ExtraArgs={'ContentType': content_type}
            )
        print("Upload successful!")
    except Exception as e:
        print(f"Failed to upload: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python upload_pvc.py <local_path> <r2_key>")
    else:
        upload_local_file(sys.argv[1], sys.argv[2])
