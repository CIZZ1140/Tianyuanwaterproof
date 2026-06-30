import os
import re

directory = r'C:\天元独立站\src\content\products'
for filename in os.listdir(directory):
    if filename.endswith('.md'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace >=" with ?" in questions
        # Matches:   - question: "Text here>="
        new_content = re.sub(r'(  - question: ".*?)>="', r'\1?"', content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Fixed {filename}')
