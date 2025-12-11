import json
import re

# Read the file as text
with open('dataset_penal_code.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the JSON array
start = content.find('[')
if start == -1:
    raise ValueError("No JSON array found")

# Find the end of the JSON array (last ])
# Since there might be nested arrays, we need to balance brackets
bracket_count = 0
end = start
for i, char in enumerate(content[start:], start):
    if char == '[':
        bracket_count += 1
    elif char == ']':
        bracket_count -= 1
        if bracket_count == 0:
            end = i
            break

if bracket_count != 0:
    raise ValueError("Unbalanced brackets")

# Extract the JSON part
json_str = content[start:end+1]

# Clean up any trailing commas or issues
json_str = re.sub(r',\s*]', ']', json_str)  # Remove trailing commas before ]

# Parse the JSON
try:
    data = json.loads(json_str)
except json.JSONDecodeError as e:
    print(f"JSON error: {e}")
    print(f"Position: {e.pos}")
    print(f"Context: {json_str[e.pos-50:e.pos+50]}")
    raise

# Flatten the data if it's nested arrays
flattened = []
for item in data:
    if isinstance(item, list):
        flattened.extend(item)
    else:
        flattened.append(item)

# Standardize each object
standardized = []
for obj in flattened:
    new_obj = {
        "category": "Legal & Testimony Rights",
        "source_type": "Legislation",
        "source_name": obj.get("source_name") or obj.get("law_name", ""),
        "reference": obj.get("reference") or obj.get("section", ""),
        "text": obj.get("text", ""),
        "country": "Pakistan",
        "relevance_score": 0.97,
        "theme_tags": obj.get("theme_tags") or obj.get("keywords", [])
    }
    standardized.append(new_obj)

# Save the standardized data
with open('dataset_penal_code.json', 'w', encoding='utf-8') as f:
    json.dump(standardized, f, indent=2, ensure_ascii=False)

print("JSON standardized successfully.")
