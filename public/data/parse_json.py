import json
import re

# Read the file as text
with open('dataset_penal_code.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the outer brackets and split by objects
# The file starts with [[ and ends with ]], but it's malformed
# Let's find all the JSON objects

# Use regex to find all { ... } blocks
object_pattern = r'\{[^{}]*\{[^{}]*\}[^{}]*\}|\{[^{}]*\}'
matches = re.findall(object_pattern, content)

objects = []
for match in matches:
    try:
        obj = json.loads(match)
        objects.append(obj)
    except json.JSONDecodeError:
        print(f"Failed to parse: {match[:100]}...")
        continue

print(f"Found {len(objects)} objects")

# Now standardize them
standardized = []
for obj in objects:
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
