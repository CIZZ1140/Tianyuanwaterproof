import os
import re

# Define the root directory
root_dir = r'C:\天元独立站'

# Paths that we know are currently 404/broken on R2
broken_patterns = [
    r'https://img\.tyuanwaterproof\.com/about/[^"\']+',
    r'https://img\.tyuanwaterproof\.com/factory/[^"\']+',
    r'https://img\.tyuanwaterproof\.com/home/[^"\']+',
    # Add specific ones from SEMrush if needed
    r'https://img\.tyuanwaterproof\.com/products/pp-waterproof-membrane\.webp',
    r'https://img\.tyuanwaterproof\.com/products/geotextile-nonwoven-rolls\.webp',
    r'https://img\.tyuanwaterproof\.com/products/geotextile\.webp',
    r'https://img\.tyuanwaterproof\.com/products/hdpe-geomembrane-landfill\.webp',
    r'https://img\.tyuanwaterproof\.com/products/hdpe-geomembrane-roll\.webp',
    r'https://img\.tyuanwaterproof\.com/products/pre-applied-hdpe-waterproof-membrane\.webp',
    r'https://img\.tyuanwaterproof\.com/products/hdpe-geomembrane-surface\.webp',
    r'https://img\.tyuanwaterproof\.com/products/polyurethane-waterproof-coating\.webp'
]

placeholder_path = '/placeholder.webp'

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern in broken_patterns:
        new_content = re.sub(pattern, placeholder_path, new_content)
    
    # Special fix for about.astro which uses template literals
    new_content = new_content.replace('src={`${imgBase}about/factory-overview.webp`}', 'src={placeholder}')
    new_content = new_content.replace('src={`${imgBase}about/oem-export-packing.webp`}', 'src={placeholder}')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

# Scan directories
for subdir in ['src', 'public']:
    for root, dirs, files in os.walk(os.path.join(root_dir, subdir)):
        for file in files:
            if file.endswith(('.astro', '.md', '.ts', '.js', '.json')):
                filepath = os.path.join(root, file)
                if fix_file(filepath):
                    print(f'Fixed broken images in: {filepath}')
