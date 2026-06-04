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
    slug: 'waterproofing-membrane',
    name: 'Waterproofing Membrane',
    intro: 'Bitumen, self-adhesive, TPO, PVC and HDPE waterproofing membranes for roofing, basement and infrastructure projects.',
    items: ['SBS / APP modified bitumen membranes', 'Self adhesive bitumen membranes', 'HDPE pre-applied membranes', 'TPO / PVC membranes']
  },
  {
    slug: 'waterproofing-tape',
    name: 'Waterproofing Tape',
    intro: 'Self-adhesive sealing tapes for roof repair, pipe sealing, wall joints, window flashing and construction repair.',
    items: ['Aluminum foil bitumen flashing tape', 'Butyl waterproof tape', 'Self adhesive sealing tape', 'Customized width and packaging']
  },
  {
    slug: 'waterproofing-coating',
    name: 'Waterproofing Coating',
    intro: 'Liquid waterproofing coatings for roofs, bathrooms, basements, concrete surfaces and repair projects.',
    items: ['Polyurethane waterproofing coating', 'Acrylic waterproofing coating', 'Cementitious waterproofing coating', 'Bituminous coating']
  }
];

export const products: Product[] = [
  {
    slug: 'sbs-modified-bitumen-membrane',
    name: 'SBS Modified Bitumen Waterproofing Membrane',
    category: 'Waterproofing Membrane',
    intro: 'Flexible torch-applied bitumen membrane designed for roof, basement and civil construction waterproofing systems.',
    features: ['Good low-temperature flexibility', 'High tensile strength', 'Durable bitumen compound', 'Torch-applied installation', 'Suitable for exposed or covered systems'],
    applications: ['Flat roofs', 'Basements', 'Underground structures', 'Industrial buildings'],
    specs: [['Thickness', '3.0mm / 4.0mm or customized'], ['Width', '1m'], ['Length', '10m / roll'], ['Surface', 'PE film / sand / mineral granule / aluminum foil'], ['Reinforcement', 'Polyester or fiberglass']]
  },
  {
    slug: 'app-modified-bitumen-membrane',
    name: 'APP Modified Bitumen Waterproofing Membrane',
    category: 'Waterproofing Membrane',
    intro: 'Heat-resistant bitumen membrane for roofing and waterproofing applications in warm climates.',
    features: ['Excellent heat resistance', 'Stable dimensional performance', 'Strong waterproof barrier', 'Torch-applied seams', 'Multiple surface options'],
    applications: ['Roofing projects', 'High-temperature areas', 'Industrial roofs', 'Civil buildings'],
    specs: [['Thickness', '3.0mm / 4.0mm'], ['Width', '1m'], ['Length', '10m / roll'], ['Surface', 'PE / sand / mineral / aluminum'], ['Standard', 'Customized according to project requirement']]
  },
  {
    slug: 'self-adhesive-bitumen-membrane',
    name: 'Self Adhesive Bitumen Waterproofing Membrane',
    category: 'Waterproofing Membrane',
    intro: 'Cold-applied self-adhesive waterproofing membrane for basement, roof and construction joint sealing.',
    features: ['Cold application without torch', 'Strong adhesion to prepared substrates', 'Convenient installation', 'Good crack bridging ability', 'Available with different surface films'],
    applications: ['Basements', 'Roofs', 'Retaining walls', 'Construction joints'],
    specs: [['Thickness', '1.2mm / 1.5mm / 2.0mm'], ['Width', '1m or customized'], ['Length', '10m / 15m / 20m'], ['Surface', 'PE film / PET film / aluminum foil'], ['Adhesive', 'Modified bitumen']]
  },
  {
    slug: 'hdpe-pre-applied-waterproofing-membrane',
    name: 'HDPE Pre-applied Waterproofing Membrane',
    category: 'Waterproofing Membrane',
    intro: 'Pre-applied waterproofing membrane for underground structures, foundation slabs and below-grade projects.',
    features: ['Fully bonded system after concrete pouring', 'Excellent puncture resistance', 'Designed for below-grade structures', 'Reliable lap sealing', 'Suitable for large-scale construction'],
    applications: ['Foundation slabs', 'Underground walls', 'Subways', 'Tunnels'],
    specs: [['Thickness', '1.2mm / 1.5mm / 2.0mm'], ['Width', '2m or customized'], ['Length', '20m / roll'], ['Main layer', 'HDPE sheet'], ['Installation', 'Pre-applied system']]
  },
  {
    slug: 'tpo-waterproofing-membrane',
    name: 'TPO Waterproofing Membrane',
    category: 'Waterproofing Membrane',
    intro: 'Thermoplastic polyolefin waterproofing membrane for exposed roofing and industrial waterproofing systems.',
    features: ['Hot-air weldable seams', 'UV-resistant surface', 'Good weather resistance', 'Light color option for roofing', 'Suitable for exposed roof systems'],
    applications: ['Commercial roofs', 'Industrial roofs', 'Light steel buildings', 'Roof repair'],
    specs: [['Thickness', '1.2mm / 1.5mm / 2.0mm'], ['Width', '2m / customized'], ['Length', '20m / roll'], ['Color', 'White / grey / customized'], ['Surface', 'Smooth or reinforced']]
  },
  {
    slug: 'pvc-waterproofing-membrane',
    name: 'PVC Waterproofing Membrane',
    category: 'Waterproofing Membrane',
    intro: 'PVC waterproofing membrane for roofs, tunnels, basements and civil engineering waterproofing.',
    features: ['Flexible PVC sheet', 'Hot-air welding installation', 'Good aging resistance', 'Optional reinforced type', 'Suitable for complex details'],
    applications: ['Roof waterproofing', 'Tunnel waterproofing', 'Basement waterproofing', 'Reservoirs'],
    specs: [['Thickness', '1.2mm / 1.5mm / 2.0mm'], ['Width', '2m / customized'], ['Length', '20m / roll'], ['Color', 'Grey / white / customized'], ['Type', 'Homogeneous / reinforced']]
  },
  {
    slug: 'aluminum-foil-bitumen-flashing-tape',
    name: 'Aluminum Foil Bitumen Flashing Tape',
    category: 'Waterproofing Tape',
    intro: 'Self-adhesive bitumen flashing tape with aluminum foil surface for roof repair, pipe sealing and joint waterproofing.',
    features: ['Self-adhesive and easy to apply', 'Aluminum foil weather-resistant surface', 'Good adhesion to metal, concrete, wood and plastic', 'Suitable for repair and sealing', 'Available in different widths'],
    applications: ['Roof leakage repair', 'Pipe and duct sealing', 'Window flashing', 'Gutter repair', 'Metal sheet lap sealing'],
    specs: [['Width', '5cm, 10cm, 15cm, 20cm, 30cm'], ['Roll length', '10m / roll'], ['Thickness', '1.0mm, 1.2mm, 1.5mm or customized'], ['Top surface', 'Aluminum foil / release film'], ['Packaging', 'Carton / pallet']]
  },
  {
    slug: 'butyl-waterproof-tape',
    name: 'Butyl Waterproof Tape',
    category: 'Waterproofing Tape',
    intro: 'Flexible butyl sealing tape for construction joints, roofing sheets, windows and waterproof repair applications.',
    features: ['Good sealing performance', 'Flexible and conformable', 'Cold-applied installation', 'Clean and convenient repair', 'Customized width available'],
    applications: ['Metal roofing', 'Window joints', 'Wall panel joints', 'Pipe sealing'],
    specs: [['Width', 'Customized'], ['Length', '5m / 10m / customized'], ['Adhesive', 'Butyl rubber'], ['Surface', 'Aluminum foil / PE film / non-woven'], ['Packaging', 'Carton']]
  },
  {
    slug: 'self-adhesive-sealing-tape',
    name: 'Self Adhesive Sealing Tape',
    category: 'Waterproofing Tape',
    intro: 'General-purpose self-adhesive waterproof sealing tape for construction repair and joint protection.',
    features: ['Easy peel-and-stick application', 'Good initial tack', 'Suitable for repair work', 'Multiple surface options', 'OEM packaging available'],
    applications: ['Crack repair', 'Pipe sealing', 'Roof repair', 'Window flashing'],
    specs: [['Width', 'Customized'], ['Length', '10m / roll'], ['Thickness', 'Customized'], ['Surface', 'PE film / aluminum foil'], ['OEM', 'Available']]
  },
  {
    slug: 'polyurethane-waterproofing-coating',
    name: 'Polyurethane Waterproofing Coating',
    category: 'Waterproofing Coating',
    intro: 'Liquid-applied polyurethane waterproofing coating for roofs, basements, bathrooms and concrete surfaces.',
    features: ['Seamless waterproof layer', 'Good elongation', 'Excellent adhesion to prepared substrates', 'Suitable for complex details', 'Brush, roller or spray application'],
    applications: ['Roofs', 'Bathrooms', 'Basements', 'Balconies', 'Concrete decks'],
    specs: [['Type', 'Single or two-component'], ['Color', 'Black / grey / customized'], ['Packaging', '20kg pail or customized'], ['Application', 'Brush / roller / spray'], ['Storage', 'Cool and dry place']]
  },
  {
    slug: 'acrylic-waterproofing-coating',
    name: 'Acrylic Waterproofing Coating',
    category: 'Waterproofing Coating',
    intro: 'Water-based acrylic waterproofing coating for exposed roofs, wall surfaces and maintenance repair projects.',
    features: ['Water-based formula', 'UV-resistant surface', 'Easy application', 'Good weather resistance', 'Suitable for maintenance projects'],
    applications: ['Roof maintenance', 'Exterior walls', 'Concrete surfaces', 'Repair coating'],
    specs: [['Type', 'Water-based acrylic'], ['Color', 'White / grey / customized'], ['Packaging', '18kg / 20kg pail'], ['Application', 'Brush / roller / spray'], ['Surface', 'Exposed or protected use']]
  },
  {
    slug: 'cementitious-waterproofing-coating',
    name: 'Cementitious Waterproofing Coating',
    category: 'Waterproofing Coating',
    intro: 'Cement-based waterproofing coating for bathrooms, basements, water tanks and concrete structures.',
    features: ['Good bonding with concrete', 'Suitable for wet areas', 'Easy mixing and application', 'Durable mineral layer', 'Compatible with tile systems'],
    applications: ['Bathrooms', 'Kitchens', 'Basements', 'Water tanks', 'Concrete walls'],
    specs: [['Type', 'One or two-component'], ['Color', 'Grey / white'], ['Packaging', 'Powder bag / liquid component'], ['Application', 'Brush or roller'], ['Substrate', 'Concrete and masonry']]
  },
  {
    slug: 'bituminous-waterproofing-coating',
    name: 'Bituminous Waterproofing Coating',
    category: 'Waterproofing Coating',
    intro: 'Bitumen-based coating for foundation, roof maintenance and general waterproofing protection.',
    features: ['Bitumen waterproof barrier', 'Suitable for foundation protection', 'Good substrate coverage', 'Economical repair option', 'Brush or roller application'],
    applications: ['Foundations', 'Roof repair', 'Retaining walls', 'Underground structures'],
    specs: [['Type', 'Bitumen-based coating'], ['Color', 'Black'], ['Packaging', '20kg pail'], ['Application', 'Brush / roller'], ['Use', 'Protected waterproofing layer']]
  }
];

export const featuredProducts = products.slice(0, 8);
