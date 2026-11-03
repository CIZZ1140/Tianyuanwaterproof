import pagePaths from './page-paths.json' with { type: 'json' };

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'th', label: 'ไทย' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'es', label: 'Español' },
  { code: 'pt-br', label: 'Português' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' }
];
export const translationLocales = languages.filter(language => language.code !== 'en').map(language => language.code);
export const localizedPaths = pagePaths;
export const productSlugs = pagePaths.filter(path => /^\/products\/[^/]+\/$/.test(path)).map(path => path.split('/')[2]);
export const categoryIds = pagePaths.filter(path => /^\/categories\/[^/]+\/$/.test(path)).map(path => path.split('/')[2]);
/** @param {string} path @returns {'en' | 'th' | 'vi' | 'es' | 'pt-br' | 'fr' | 'ar'} */
export function localeOf(path) {
  const locale = path.match(/^\/(th|vi|es|pt-br|fr|ar)(?:\/|$)/)?.[1];
  return locale === 'th' || locale === 'vi' || locale === 'es' || locale === 'pt-br' || locale === 'fr' || locale === 'ar' ? locale : 'en';
}
export function basePath(path) {
  const result = path.replace(/^\/(th|vi|es|pt-br|fr|ar)(?=\/|$)/, '') || '/';
  return result.endsWith('/') ? result : result + '/';
}
export function languagePath(path, locale) {
  return locale === 'en' ? path : `/${locale}${path}`;
}
export function languageAlternates(path) {
  const base = basePath(path);
  if (!localizedPaths.includes(base)) return [];
  return [...languages.map(lang => ({ hreflang: lang.code, href: languagePath(base, lang.code) })), { hreflang: 'x-default', href: base }];
}
