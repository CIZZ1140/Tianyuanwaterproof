import os
import yaml

directory = r'C:\天元独立站\src\content\products'
files = [f for f in os.listdir(directory) if f.endswith('.md')]

errors_found = []
for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    parts = content.split('---')
    if len(parts) >= 3:
        header = parts[1]
        try:
            yaml.safe_load(header)
        except Exception as e:
            errors_found.append(f"{filename}: {str(e)}")

if not errors_found:
    print("ALL CLEAR: All YAML files are valid.")
else:
    print("ERRORS FOUND:")
    for err in errors_found:
        print(err)
