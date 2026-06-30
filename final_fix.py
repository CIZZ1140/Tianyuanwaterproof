import os
import re

directory = r'src/content/products'
files = [f for f in os.listdir(directory) if f.endswith('.md')]

fixed_count = 0
for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    new_lines = []
    file_changed = False
    for line in lines:
        # If line contains unit: ">= and doesn't end with a quote (allowing for newline)
        stripped = line.strip()
        if 'unit: ">=' in stripped and not stripped.endswith('"'):
            line = line.replace('unit: ">', 'unit: ">="')
            file_changed = True
        new_lines.append(line)
    
    if file_changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        fixed_count += 1

print(f'Final check: Fixed {fixed_count} hidden quote issues.')
