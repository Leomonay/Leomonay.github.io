// Section anchors. IDs are language-neutral on purpose: switching /es/ ↔ /en/ keeps
// the same #hash, so the visitor lands on the same section in the other language.
export const SECTIONS = {
  hero: 'top',
  about: 'about',
  featured: 'featured-project',
  experience: 'experience',
  career: 'career',
  education: 'education',
  recommendations: 'recommendations',
  contact: 'contact',
};

// Sections linked from the navbar, in page order. Labels come from messages (nav.sections.<id>).
export const NAV_SECTIONS = [
  SECTIONS.about,
  SECTIONS.featured,
  SECTIONS.experience,
  SECTIONS.education,
  SECTIONS.contact,
];
