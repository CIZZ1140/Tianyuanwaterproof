import os
import re

directory = r'C:\天元独立站\src\content\products'
fixes = [
    # Question marks (safety check)
    (r'(  - question: ".*?)>="', r'\1?"'),
    
    # Range fixes based on common patterns
    (r'5,000>=,000', r'5,000 - 8,000'),
    (r'8,000>=2,000', r'8,000 - 12,000'),
    (r'10,000>=2,000', r'10,000 - 12,000'),
    (r'15,000>=0,000', r'15,000 - 20,000'),
    (r'2,000>=,000', r'2,000 - 4,000'),
    (r'1.3 >=1.5', r'1.3 - 1.5'),
    
    # Geotextile scientific notation (Permeability k)
    (r'10⁻>=to 10⁻>=', r'10^-1 to 10^-3'),
    (r'1.0 - 9.0 × 10⁻>=', r'1.0 - 9.0 x 10^-3'),
    
    # Width text corruption
    (r'宽度>=\*\*8.0 >=* 的卷材。这能显著减少大面积工程中的重叠数量和材料损耗>=', r'up to 8.0m width. This significantly reduces the number of overlaps and material loss in large-scale projects.'),
    (r'宽度>=\*\*8.0 >=* 的卷材。这能显著减少现场焊缝数量。焊缝通常是防渗工程中最容易发生泄漏的点>=', r'up to 8.0m width. This significantly reduces the number of on-site welds, which are typically the most vulnerable points for leakage in seepage control projects.'),
    
    # Chemical formulas / other
    (r'Ca\(OH\)>=\×', r'Ca(OH)2 x'),
    (r'100g/m²>=00g/m²', r'100g/m2 to 800g/m2'),
    
    # Units cleanup
    (r'm²', 'sqm'),
    (r'g/cm³', 'g/cm3'),
    (r'°', 'deg'),
]

for filename in os.listdir(directory):
    if filename.endswith('.md'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in fixes:
            new_content = re.sub(pattern, replacement, new_content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Polished {filename}')
