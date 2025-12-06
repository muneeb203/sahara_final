// Law book data structure
export interface LawSection {
  category: string;
  source_type: string;
  source_name: string;
  reference: string;
  text: string;
  country: string;
  relevance_score: number;
  theme_tags: string[];
}

export interface LawBook {
  id: string;
  title: string;
  description: string;
  category: string;
  sections: LawSection[];
  pdfPath?: string;
  year?: string;
}

// Mapping of JSON files to their PDF counterparts
const lawFilesMapping = [
  {
    jsonFile: 'dataset_penal_code.json',
    pdfFile: 'Pakistan Penal Code.pdf',
    id: 'pakistan-penal-code',
    category: 'Criminal Law',
  },
  {
    jsonFile: 'kp-women-rights-enf-2019.json',
    pdfFile: 'KP-Enforcement-of-Womens-Property-Rights-bill-2019.pdf',
    id: 'kp-women-property-rights-2019',
    category: 'Property Rights',
  },
  {
    jsonFile: 'muslim-family-law-ord.json',
    pdfFile: 'Muslim-Family-Laws-Ordinance-1961.pdf',
    id: 'muslim-family-laws-1961',
    category: 'Family Law',
  },
  {
    jsonFile: 'prev-of-elec-crime-act-2016.json',
    pdfFile: 'Prevention-of-Electronic-Crime-Act-2016.pdf',
    id: 'prevention-electronic-crime-2016',
    category: 'Cyber Crime',
  },
  {
    jsonFile: 'protec-harras-at-workspace-act2010.json',
    pdfFile: 'Protection against harassment of women at workplace act 2010.pdf',
    id: 'harassment-workplace-2010',
    category: 'Workplace Rights',
  },
  {
    jsonFile: 'punjab-protec-act.json',
    pdfFile: 'PUNJAB_PROTECTION_OF_WOMEN_AGAINST_VIOLENCE_ACT_2016.pdf',
    id: 'punjab-protection-violence-2016',
    category: 'Violence Protection',
  },
  {
    jsonFile: 'motor_veh_ord_1965.json',
    pdfFile: null,
    id: 'motor-vehicle-ordinance-1965',
    category: 'Traffic Law',
  },
];

// Load and parse law books from JSON files
export async function loadLawBooks(): Promise<LawBook[]> {
  const lawBooks: LawBook[] = [];

  for (const mapping of lawFilesMapping) {
    try {
      const response = await fetch(`/data/${mapping.jsonFile}`);
      if (!response.ok) continue;
      
      const sections: LawSection[] = await response.json();
      
      if (sections.length === 0) continue;

      // Extract metadata from first section
      const firstSection = sections[0];
      const title = firstSection.source_name;
      
      // Generate description from category and theme tags
      const uniqueTags = [...new Set(sections.flatMap(s => s.theme_tags))];
      const description = `Covers ${uniqueTags.slice(0, 5).join(', ')} and related matters under ${firstSection.source_type}.`;

      lawBooks.push({
        id: mapping.id,
        title,
        description,
        category: mapping.category,
        sections,
        pdfPath: mapping.pdfFile ? `/data/${mapping.pdfFile}` : undefined,
      });
    } catch (error) {
      console.error(`Error loading ${mapping.jsonFile}:`, error);
    }
  }

  return lawBooks;
}

// Get a single law book by ID
export async function getLawBookById(id: string): Promise<LawBook | null> {
  const lawBooks = await loadLawBooks();
  return lawBooks.find(book => book.id === id) || null;
}

// Get all unique categories
export function getCategories(lawBooks: LawBook[]): string[] {
  const categories = lawBooks.map(book => book.category);
  return ['All Categories', ...new Set(categories)];
}
