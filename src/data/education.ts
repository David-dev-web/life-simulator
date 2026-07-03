import type { EducationLevel } from '../types/game';

export interface EducationInfo {
  level: EducationLevel;
  title: { de: string; en: string };
  minAge: number;
  maxAge: number;
  durationYears: number;
  yearlyCost: number; // Base currency
  minIntelligence: number;
  requiredPrevLevel: EducationLevel;
}

export const EDUCATION_LEVELS: Record<EducationLevel, EducationInfo> = {
  none: {
    level: 'none',
    title: { de: 'Keine Ausbildung', en: 'No Education' },
    minAge: 0,
    maxAge: 100,
    durationYears: 0,
    yearlyCost: 0,
    minIntelligence: 0,
    requiredPrevLevel: 'none'
  },
  kindergarten: {
    level: 'kindergarten',
    title: { de: 'Kindergarten', en: 'Kindergarten' },
    minAge: 3,
    maxAge: 5,
    durationYears: 3,
    yearlyCost: 0,
    minIntelligence: 0,
    requiredPrevLevel: 'none'
  },
  elementary: {
    level: 'elementary',
    title: { de: 'Grundschule', en: 'Elementary School' },
    minAge: 6,
    maxAge: 9,
    durationYears: 4,
    yearlyCost: 0,
    minIntelligence: 0,
    requiredPrevLevel: 'kindergarten'
  },
  middle_school: {
    level: 'middle_school',
    title: { de: 'Mittelschule / Realschule', en: 'Middle School' },
    minAge: 10,
    maxAge: 15,
    durationYears: 6,
    yearlyCost: 0,
    minIntelligence: 10,
    requiredPrevLevel: 'elementary'
  },
  high_school: {
    level: 'high_school',
    title: { de: 'Gymnasium / Abitur', en: 'High School' },
    minAge: 10,
    maxAge: 18,
    durationYears: 8,
    yearlyCost: 0,
    minIntelligence: 30,
    requiredPrevLevel: 'elementary'
  },
  vocational: {
    level: 'vocational',
    title: { de: 'Berufsausbildung / Lehre', en: 'Vocational Training' },
    minAge: 16,
    maxAge: 50,
    durationYears: 3,
    yearlyCost: 0,
    minIntelligence: 20,
    requiredPrevLevel: 'middle_school'
  },
  university: {
    level: 'university',
    title: { de: 'Universitätsstudium (Bachelor/Master)', en: 'University Degree' },
    minAge: 18,
    maxAge: 70,
    durationYears: 4,
    yearlyCost: 3000,
    minIntelligence: 55,
    requiredPrevLevel: 'high_school'
  },
  doctorate: {
    level: 'doctorate',
    title: { de: 'Promotion (Doktortitel)', en: 'Doctorate / PhD' },
    minAge: 22,
    maxAge: 80,
    durationYears: 3,
    yearlyCost: 5000,
    minIntelligence: 75,
    requiredPrevLevel: 'university'
  }
};

export const STUDY_FIELDS: { id: string; name: { de: string; en: string }; minInt: number }[] = [
  { id: 'cs', name: { de: 'Informatik & Software', en: 'Computer Science' }, minInt: 65 },
  { id: 'med', name: { de: 'Humanmedizin', en: 'Medicine' }, minInt: 80 },
  { id: 'law', name: { de: 'Rechtswissenschaften (Jura)', en: 'Law' }, minInt: 75 },
  { id: 'biz', name: { de: 'BWL & Wirtschaft', en: 'Business Administration' }, minInt: 55 },
  { id: 'eng', name: { de: 'Maschinenbau & Ingenieurswesen', en: 'Engineering' }, minInt: 70 },
  { id: 'art', name: { de: 'Kunst & Design', en: 'Arts & Design' }, minInt: 45 },
  { id: 'music', name: { de: 'Musik & Darstellende Kunst', en: 'Music & Performing Arts' }, minInt: 40 },
  { id: 'edu', name: { de: 'Lehramt & Pädagogik', en: 'Education & Teaching' }, minInt: 50 },
  { id: 'psych', name: { de: 'Psychologie', en: 'Psychology' }, minInt: 65 },
  { id: 'sci', name: { de: 'Naturwissenschaften (Physik/Chemie/Bio)', en: 'Natural Sciences' }, minInt: 75 }
];
