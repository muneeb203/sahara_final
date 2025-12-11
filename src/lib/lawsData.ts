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
  // Islamic-specific fields
  translation?: string;
  semantic_score?: number;
  matched_theme?: string;
}

export interface LawBook {
  id: string;
  title: string;
  description: string;
  category: string;
  mainCategory: 'Legal Laws' | 'Islamic Laws';
  sections: LawSection[];
  pdfPath?: string;
  year?: string;
}

// Mapping of legal JSON files to their PDF counterparts
const legalFilesMapping = [
  {
    jsonFile: 'dataset_penal_code.json',
    pdfFile: 'Pakistan Penal Code.pdf',
    id: 'pakistan-penal-code',
    category: 'Criminal Law',
    dataPath: 'legal',
  },
  {
    jsonFile: 'kp-women-rights-enf-2019.json',
    pdfFile: 'KP-Enforcement-of-Womens-Property-Rights-bill-2019.pdf',
    id: 'kp-women-property-rights-2019',
    category: 'Property Rights',
    dataPath: 'legal',
  },
  {
    jsonFile: 'muslim-family-law-ord.json',
    pdfFile: 'Muslim-Family-Laws-Ordinance-1961.pdf',
    id: 'muslim-family-laws-1961',
    category: 'Family Law',
    dataPath: 'legal',
  },
  {
    jsonFile: 'prev-of-elec-crime-act-2016.json',
    pdfFile: 'Prevention-of-Electronic-Crime-Act-2016.pdf',
    id: 'prevention-electronic-crime-2016',
    category: 'Cyber Crime',
    dataPath: 'legal',
  },
  {
    jsonFile: 'protec-harras-at-workspace-act2010.json',
    pdfFile: 'Protection against harassment of women at workplace act 2010.pdf',
    id: 'harassment-workplace-2010',
    category: 'Workplace Rights',
    dataPath: 'legal',
  },
  {
    jsonFile: 'punjab-protec-act.json',
    pdfFile: 'PUNJAB_PROTECTION_OF_WOMEN_AGAINST_VIOLENCE_ACT_2016.pdf',
    id: 'punjab-protection-violence-2016',
    category: 'Violence Protection',
    dataPath: 'legal',
  },
  {
    jsonFile: 'motor_veh_ord_1965.json',
    pdfFile: null,
    id: 'motor-vehicle-ordinance-1965',
    category: 'Traffic Law',
    dataPath: 'legal',
  },
];

// Mapping of Islamic JSON files
const islamicFilesMapping = [
  {
    jsonFile: 'filtered_ahadith.json',
    pdfFile: null,
    id: 'filtered-ahadith',
    category: 'Hadith Collection',
    dataPath: 'islamic',
  },
  {
    jsonFile: 'filtered_ahadith2.json',
    pdfFile: null,
    id: 'filtered-ahadith-2',
    category: 'Hadith Collection 2',
    dataPath: 'islamic',
  },
  {
    jsonFile: 'herhaq_sahih_muslim_hadiths.json',
    pdfFile: null,
    id: 'sahih-muslim-hadiths',
    category: 'Sahih Muslim',
    dataPath: 'islamic',
  },
];

// Load and parse law books from JSON files
export async function loadLawBooks(): Promise<LawBook[]> {
  const lawBooks: LawBook[] = [];

  // Load legal laws
  for (const mapping of legalFilesMapping) {
    try {
      const response = await fetch(`/data/${mapping.dataPath}/${mapping.jsonFile}`);
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
        mainCategory: 'Legal Laws',
        sections,
        pdfPath: mapping.pdfFile ? `/data/${mapping.dataPath}/${mapping.pdfFile}` : undefined,
      });
    } catch (error) {
      console.error(`Error loading legal ${mapping.jsonFile}:`, error);
    }
  }

  // Load Islamic laws
  for (const mapping of islamicFilesMapping) {
    try {
      const response = await fetch(`/data/${mapping.dataPath}/${mapping.jsonFile}`);
      if (!response.ok) continue;
      
      const sections: LawSection[] = await response.json();
      
      if (sections.length === 0) continue;

      // Extract metadata from first section
      const firstSection = sections[0];
      const title = firstSection.source_name || mapping.category;
      
      // Generate description from category and theme tags
      const uniqueTags = [...new Set(sections.flatMap(s => s.theme_tags))];
      const description = `Islamic guidance on ${uniqueTags.slice(0, 5).join(', ')} from ${firstSection.source_type}.`;

      lawBooks.push({
        id: mapping.id,
        title,
        description,
        category: mapping.category,
        mainCategory: 'Islamic Laws',
        sections,
      });
    } catch (error) {
      console.error(`Error loading Islamic ${mapping.jsonFile}:`, error);
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
  const mainCategories = ['Legal Laws', 'Islamic Laws'];
  const subCategories = lawBooks.map(book => book.category);
  return ['All Categories', ...mainCategories, ...new Set(subCategories)];
}

// Get categories by main type
export function getCategoriesByType(lawBooks: LawBook[], mainCategory: 'Legal Laws' | 'Islamic Laws'): string[] {
  const filteredBooks = lawBooks.filter(book => book.mainCategory === mainCategory);
  const categories = filteredBooks.map(book => book.category);
  return [...new Set(categories)];
}
