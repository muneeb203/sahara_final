import json

# Load the JSON file
with open('dataset_penal_code.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

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
