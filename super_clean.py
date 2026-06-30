import os
import re

directory = r'C:\天元独立站\src\content\products'

def super_clean(text):
    # 1. Fix missing closing quotes on common fields
    lines = text.splitlines()
    for i in range(len(lines)):
        line = lines[i]
        # Match lines like:    requirement: "something
        # But not lines like:    requirement: "something"
        if re.match(r'^\s+(requirement|value|unit|label|question|answer|text|title|description):\s+"[^"]+$', line):
            lines[i] = line + '"'
    
    text = '\n'.join(lines)
    
    # 2. Fix the corrupted width text (Chinese/corrupted English mix)
    text = re.sub(r'我们提供宽度>=\*\*8\.0 >=* 的卷材。这能显著减少大面积工程中的重叠数量和材料损耗>=', 
                  'We provide membranes with a width of up to 8.0m. This significantly reduces the number of overlaps and material loss in large-scale projects.', text)
    text = re.sub(r'我们提供宽度>=\*\*8\.0 >=* 的卷材。这能显著减少现场焊缝数量。焊缝通常是防渗工程中最容易发生泄漏的点>=', 
                  'We provide membranes with a width of up to 8.0m. This significantly reduces the number of on-site welds, which are typically the most vulnerable points for leakage.', text)

    # 3. Clean up any remaining >= that look like corrupted question marks at end of questions
    text = re.sub(r'(  - question: ".*?)>="', r'\1?"', text)
    
    # 4. Final non-ASCII cleanup for Vercel stability
    text = text.replace('m²', 'sqm').replace('m³', 'cum').replace('°', 'deg')
    
    return text

for filename in os.listdir(directory):
    if filename.endswith('.md'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = super_clean(content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Super cleaned {filename}')
