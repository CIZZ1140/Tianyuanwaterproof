// Treat whitespace inside compound SI units as typography, while retaining
// their exact unit and multiplicity. A dotted abbreviation such as e.g. is
// prose, not a gram measurement.
export const technicalUnits=value=>{
  const normalized=value.replace(/square met(?:er|re)s?|ตารางเมตร|mét vuông|metros? [cq]uadrados?/gi,' m² ')
    .replace(/\bN\s*\/\s*(50)?\s*mm/g,'N/$1mm')
    .replace(/\b(kg|g)\s*\/\s*m([²³23])/g,'$1/m$2');
  return (normalized.match(/(?<![\p{L}\p{M}.])(?:N\/(?:50)?mm|kg\/m[²2]|g\/(?:cm[³3]|m[²2])|mm|cm|kg|MPa|kPa|m[²³23]|min|pcs|lbs?|ft|g|m)(?![\p{L}\p{M}])/gu)||[]).sort();
};
