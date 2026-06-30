import os

directory = r'C:\天元独立站\src\content\products'
files = [f for f in os.listdir(directory) if f.endswith('.md')]

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        # If line contains unit: ">=" and has trailing garbage, clean it
        if 'unit: ">="' in line:
            # Strictly reset to the safe version
            line = line.split('unit:')[0] + 'unit: ">="\n'
        new_lines.append(line)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

print('Fully sanitized all unit fields across 18 files.')
