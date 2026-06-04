export type Product = {
  slug: string;
  name: string;
  category: 'Waterproofing Membrane' | 'Waterproofing Tape' | 'Waterproofing Coating';
  intro: string;
  features: string[];
  applications: string[];
  specs: [string, string][];
};

export const categories = [
  {
    slug: 'bitumen-membranes',
    name: 'Bitumen Membranes',
    intro: 'High-performance SBS/APP modified bitumen and traditional saturated organic membranes.',
    items: ['SBS/APP Modified Bitumen Membrane', 'Petroleum Saturated Organic Roofing Felt']
  },
  {
    slug: 'self-adhesive-series',
    name: 'Self-Adhesive Series',
    intro: 'Cold-applied self-adhesive waterproofing solutions for metal roofing and various substrates.',
    items: ['Self-Adhesive Color Steel Membrane']
  }
];

export const products: Product[] = [
  {
    slug: 'sbs-torch-applied-membrane',
    name: 'SBS/APP Modified Bitumen Torch-applied Waterproofing Membrane',
    category: 'Waterproofing Membrane',
    intro: 'High-performance SBS/APP modified bitumen membrane for roofs, tunnels, and underground projects.',
    features: ['High Heat & Corrosion Resistance', 'UV Resistant', 'Anti-aging', 'Torch-applied installation'],
    applications: ['Roofs', 'Tunnels', 'Underground Projects'],
    specs: [['Thickness', '3.0mm / 4.0mm'], ['Length', '10m/roll'], ['Surface', 'PE / Aluminum / Sand / Mineral']]
  },
  {
    slug: 'self-adhesive-color-steel-membrane',
    name: 'Self-Adhesive Waterproof Membrane for Color Steel & Metal Roofing',
    category: 'Waterproofing Membrane',
    intro: 'Cold-applied self-adhesive bitumen membrane with super strong adhesion to metal.',
    features: ['Cold-applied', 'Super Strong Adhesion', 'Easy Peel-and-stick'],
    applications: ['Industrial Warehouses', 'Metal Roofing'],
    specs: [['Thickness', '1.2mm / 1.5mm / 2.0mm'], ['Material', 'Self-adhesive Bitumen'], ['Application', 'Cold-applied (Peel-and-stick)']]
  },
  {
    slug: 'organic-roofing-felt',
    name: 'Petroleum Saturated Organic Roofing Felt (15lb / 30lb)',
    category: 'Waterproofing Membrane',
    intro: 'High absorption petroleum saturated organic paper roofing felt.',
    features: ['High Absorption', 'Secondary Waterproof Barrier', 'Excellent Flexibility'],
    applications: ['Underlayment', 'Residential Roofs'],
    specs: [['Weight', '15lb / 30lb'], ['Material', 'Petroleum Saturated Organic Paper'], ['Certification', 'Non-ASTM']]
  }
];

export const featuredProducts = products;

