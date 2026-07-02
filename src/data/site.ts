export const site = {
  name: 'Tianyuan Waterproof',
  shortName: 'Tianyuan',
  brand: 'Tianyuan Waterproof',
  title: 'Weifang Tianyuan Waterproof Material Co., Ltd.',
  description: 'Professional manufacturer of high-quality modified bitumen waterproofing membranes, polymer membranes, and coatings.',
  url: 'https://www.tyuanwaterproof.com',
  ogImage: 'https://www.tyuanwaterproof.com/og.jpg',
  address: 'Weifang City, Shandong Province, China',
  phone: '+86 15263640998',
  email: 'sales@tyuanwaterproof.com',
  whatsapp: '+86 15263640998',
  socials: {
    facebook: '#',
    linkedIn: '#',
    youtube: '#'
  }
};

export const nav = [
  { label: 'Home', href: '/' },
  { 
    label: 'Products', 
    href: '/products/',
    children: [
      { label: 'Bitumen Membranes', href: '/categories/bitumen-membranes/' },
      { label: 'Polymer Membranes', href: '/categories/polymer-membranes/' },
      { label: 'Waterproof Coatings', href: '/categories/waterproof-coatings/' },
      { label: 'Waterproof Tapes', href: '/categories/waterproof-tapes/' },
      { label: 'Asphalt Shingles', href: '/categories/asphalt-shingles/' },
      { label: 'Geosynthetics', href: '/categories/geosynthetics/' }
    ]
  },
  { label: 'Solutions', href: '/applications/' },
  { 
    label: 'Resources', 
    href: '/technical/',
    children: [
      { label: 'Technical Data', href: '/technical/' },
      { label: 'Case Studies', href: '/projects/' },
      { label: 'Selection Guides', href: '/technical/installation-guide/' },
      { label: 'FAQ', href: '/technical/faq/' }
    ]
  },
  { label: 'About Us', href: '/about/' },
  { label: 'Contact', href: '/contact/' }
];

export const productCategories = [
  {
    title: 'Bitumen Membranes',
    slug: 'bitumen-membranes',
    href: '/categories/bitumen-membranes/',
    image: 'https://img.tyuanwaterproof.com/cat-bitumen-membranes.webp',
    description: 'SBS/APP modified bitumen and self-adhesive waterproofing membranes for durable roofing and underground projects.',
    items: [
      { title: 'SBS Bitumen Membrane', href: '/products/sbs-bitumen-waterproofing-membrane-manufacturer/' },
      { title: 'Self-Adhesive Membrane', href: '/products/self-adhesive-bitumen-waterproofing-membrane-wholesale/' }
    ]
  },
  {
    title: 'Polymer Membranes',
    slug: 'polymer-membranes',
    href: '/categories/polymer-membranes/',
    image: 'https://img.tyuanwaterproof.com/cat-polymer-membranes.webp',
    description: 'Advanced PVC, TPO, and HDPE membranes for high-end engineering.',
    items: [
      { title: 'TPO Membrane', href: '/products/tpo-waterproofing-membrane-manufacturer/' },
      { title: 'PVC Membrane', href: '/products/pvc-waterproofing-membrane-manufacturer/' }
    ]
  },
  {
    title: 'Waterproof Coatings',
    slug: 'waterproof-coatings',
    href: '/categories/waterproof-coatings/',
    image: 'https://img.tyuanwaterproof.com/cat-waterproof-coatings-v2.webp',
    description: 'Polyurethane liquid-applied coatings for complex structures.',
    items: [
      { title: 'Polyurethane Coating', href: '/products/polyurethane-waterproof-coating-factory/' },
      { title: 'JS Cementitious Coating', href: '/products/polymer-cement-js-waterproof-coating-factory/' }
    ]
  },
  {
    title: 'Waterproof Tapes',
    slug: 'waterproof-tapes',
    href: '/categories/waterproof-tapes/',
    image: 'https://img.tyuanwaterproof.com/cat-waterproof-tapes-v2.webp',
    description: 'Butyl and bitumen self-adhesive tapes for joints and repairs.',
    items: [
      { title: 'Butyl Tape', href: '/products/butyl-waterproof-sealing-tape-supplier/' },
      { title: 'Bitumen Tape', href: '/products/self-adhesive-bitumen-tape-wholesale/' }
    ]
  },
  {
    title: 'Asphalt Shingles',
    slug: 'asphalt-shingles',
    href: '/categories/asphalt-shingles/',
    image: 'https://img.tyuanwaterproof.com/cat-asphalt-shingles.webp',
    description: 'Artistic and durable roofing shingles for residential buildings.',
    items: [
      { title: 'Laminated Asphalt Shingles', href: '/products/asphalt-roofing-felt-manufacturer/' },
      { title: '3-Tab Asphalt Shingles', href: '/products/3-tab-asphalt-shingles-wholesale/' }
    ]
  },
  {
    title: 'Geosynthetics',
    slug: 'geosynthetics',
    href: '/categories/geosynthetics/',
    image: 'https://img.tyuanwaterproof.com/products/hdpe-geomembrane-liner-roll.webp',
    description: 'Geomembranes and geotextiles for environmental and infrastructure projects.',
    items: [
      { title: 'Geomembrane', href: '/products/hdpe-geomembrane-liner-manufacturer/' },
      { title: 'Geotextile', href: '/products/geotextile-fabric-manufacturer/' }
    ]
  }
];

export const applications = [
  {
    title: 'Roof Waterproofing',
    slug: 'roof-waterproofing',
    image: '/assets/images/optimized/commercial-roof.webp',
    summary: 'Solutions for flat, pitched, industrial and civil roofs.',
    products: ['SBS Modified Bitumen', 'TPO Membrane', 'PVC Membrane']
  },
  {
    title: 'Basement Waterproofing',
    slug: 'basement-waterproofing',
    image: '/assets/images/optimized/basement.webp',
    summary: 'Heavy-duty protection for foundations and underground walls.',
    products: ['Self-Adhesive Bitumen', 'Pre-applied HDPE', 'Polyurethane Coating']
  },
  {
    title: 'Bathroom Waterproofing',
    slug: 'bathroom-waterproofing',
    image: '/assets/images/optimized/bathroom-application.webp',
    summary: 'Liquid-applied solutions for wet areas and indoor floors.',
    products: ['Polyurethane Coating', 'JS Coating', 'Self-Adhesive Tape']
  },
  {
    title: 'Tunnel Waterproofing',
    slug: 'tunnel-waterproofing',
    image: '/assets/images/optimized/tunnel.webp',
    summary: 'High-pressure resistant membranes for infrastructure projects.',
    products: ['PVC Membrane', 'HDPE Membrane', 'SBS Membrane']
  },
  {
    title: 'Joint Sealing',
    slug: 'joint-sealing',
    image: '/assets/images/optimized/basement-application.webp',
    summary: 'Flexible tapes for expansion joints and structural cracks.',
    products: ['Butyl Tape', 'Bitumen Tape']
  },
  {
    title: 'Window & Door Sealing',
    slug: 'window-door-sealing',
    image: '/assets/images/optimized/window-door-application.webp',
    summary: 'Self-adhesive flashing tapes for perimeter sealing.',
    products: ['Bitumen Tape', 'Butyl Tape']
  }
];

export const stats = [
  { value: '30+', label: 'Years Experience' },
  { value: '3', label: 'Product Lines' },
  { value: '50+', label: 'Countries Exported' },
  { value: 'OEM/ODM', label: 'Service' },
  { value: '24/7', label: 'Quick Response' }
];
