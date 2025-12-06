# Dynamic Laws Page Implementation

## Overview
The Laws page now dynamically loads law books from JSON files stored in the `/data/` directory. Each JSON file represents one law book with multiple sections/articles.

## Features Implemented

### 1. Dynamic Law Book Loading
- Automatically reads all JSON files from the `/data/` directory
- Each JSON file contains an array of law sections with metadata
- No hardcoding required - add new JSON files to automatically include new laws

### 2. Laws Listing Page (`/laws`)
- Displays all available law books as cards
- Shows:
  - Law book title (from `source_name` field)
  - Description (generated from theme tags and category)
  - Category badge
  - Number of sections
- Search functionality to filter by title or description
- Category filter dropdown
- Responsive grid layout

### 3. Law Detail Page (`/laws/:id`)
- Shows complete law book information
- Expandable accordion for each section/article
- Each section displays:
  - Reference number
  - Category
  - Full text content
  - Theme tags
- Download PDF button (if PDF is available)
- Link to discuss in chat

### 4. PDF Download Support
- Maps JSON files to their corresponding PDF files
- Download button appears only if PDF is available
- PDFs are served from `/public/data/` directory

## File Structure

```
src/
├── lib/
│   └── lawsData.ts          # Data loading and management logic
├── pages/
│   ├── Laws.tsx             # Laws listing page
│   └── LawDetail.tsx        # Individual law detail page
data/                         # Source JSON and PDF files
public/
└── data/                     # Copied data files (accessible via HTTP)
scripts/
└── copy-data.js             # Build script to copy data files
```

## Data Structure

### JSON File Format
Each JSON file contains an array of law sections:

```json
[
  {
    "category": "Legal & Testimony Rights",
    "source_type": "Legislation",
    "source_name": "Protection Against Harassment of Women at the Workplace Act, 2010",
    "reference": "Section 2(h)",
    "text": "Full text of the section...",
    "country": "Pakistan",
    "relevance_score": 0.97,
    "theme_tags": ["harassment", "workplace", "gender", "justice"]
  }
]
```

### Law Book Mapping
The `lawsData.ts` file contains a mapping array that connects:
- JSON filename
- PDF filename (if available)
- Unique ID for routing
- Category for filtering

## Adding New Law Books

To add a new law book:

1. **Add JSON file** to `/data/` directory with the structure above
2. **Add PDF file** (optional) to `/data/` directory
3. **Update mapping** in `src/lib/lawsData.ts`:

```typescript
{
  jsonFile: 'your-law-file.json',
  pdfFile: 'Your-Law-File.pdf',  // or null if no PDF
  id: 'your-law-id',
  category: 'Your Category',
}
```

4. **Run the copy script** (automatic during build):
```bash
npm run prebuild
```

## Build Process

The build process includes:
1. `prebuild` script runs `scripts/copy-data.js`
2. Copies all files from `/data/` to `/public/data/`
3. Makes JSON and PDF files accessible via HTTP
4. Vite builds the application

## Development

During development:
- Data files are loaded from `/public/data/`
- Hot reload works for code changes
- To update data files, copy them manually or restart dev server

## Categories

Current categories:
- Criminal Law
- Property Rights
- Family Law
- Cyber Crime
- Workplace Rights
- Violence Protection
- Traffic Law

Categories are automatically extracted and displayed in the filter dropdown.

## Search & Filter

- **Search**: Filters by law title and description (case-insensitive)
- **Category Filter**: Shows only laws in selected category
- **Combined**: Both filters work together

## Responsive Design

- Mobile: Single column card layout
- Tablet: 2 column grid
- Desktop: 3 column grid
- All components are fully responsive

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly

## Performance

- Lazy loading of law books
- Accordion prevents rendering all sections at once
- Efficient filtering with React state
- Minimal re-renders

## Future Enhancements

Potential improvements:
- Full-text search across all sections
- Bookmarking favorite laws
- Print-friendly view
- Share specific sections
- Multi-language support for law content
- Advanced filtering (by year, tags, etc.)
- Search within a specific law book
