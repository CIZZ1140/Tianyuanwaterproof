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
    items: ['SBS/APP Modified Bitumen Membrane']
  }
];

export const products: Product[] = [];
export const featuredProducts: Product[] = [];
