// Core TypeScript interfaces for VitaLog / OmniLife

export type Gender = 'male' | 'female' | 'diverse';

export type StartCondition = 
  | 'normal' 
  | 'wealthy' 
  | 'orphan' 
  | 'genius' 
  | 'athletic' 
  | 'sickly' 
  | 'royalty';

export interface Attributes {
  health: number;     // 0-100
  happiness: number;  // 0-100
  intelligence: number; // 0-100
  looks: number;      // 0-100
  discipline: number; // 0-100
  stress: number;     // 0-100
  energy: number;     // 0-100
  karma: number;      // 0-100
}

export interface Country {
  id: string;
  name: { de: string; en: string };
  flag: string;
  currencySymbol: string;
  currencyCode: string;
  salaryMultiplier: number;
  taxRate: number; // Decimal e.g. 0.30
  educationQuality: number;
  healthcareQuality: number;
}

export type EducationLevel = 
  | 'none' 
  | 'kindergarten' 
  | 'elementary' 
  | 'middle_school' 
  | 'high_school' 
  | 'vocational' 
  | 'university' 
  | 'doctorate';

export interface EducationStatus {
  currentLevel: EducationLevel;
  completedLevels: EducationLevel[];
  grade: number; // 0-100 (100 is best)
  yearsInCurrentLevel: number;
  isStudying: boolean;
  fieldOfStudy?: string;
}

export interface Job {
  id: string;
  title: { de: string; en: string };
  category: 'retail' | 'craft' | 'public' | 'tech' | 'medical' | 'legal' | 'business' | 'creative' | 'sports' | 'service' | 'crime' | 'military';
  minEducation: EducationLevel;
  requiredField?: string;
  minIntelligence: number;
  minLooks: number;
  minDiscipline: number;
  baseSalary: number; // Annual in base currency
  stressLevel: number; // 0-100 added per year
  promotionJobId?: string;
  yearsForPromotion?: number;
}

export interface CareerStatus {
  currentJob?: Job;
  yearsInJob: number;
  salary: number;
  performance: number; // 0-100
  isUnemployed: boolean;
  hasRetired: boolean;
  pension: number;
  jobHistory: string[];
}

export type RelationshipType = 'mother' | 'father' | 'sibling' | 'friend' | 'partner' | 'spouse' | 'child' | 'ex' | 'pet';

export interface Person {
  id: string;
  name: string;
  type: RelationshipType;
  gender: Gender;
  age: number;
  relationship: number; // 0-100
  health: number;
  looks: number;
  intelligence: number;
  isAlive: boolean;
  jobTitle?: string;
  petSpecies?: string;
}

export interface Property {
  id: string;
  title: { de: string; en: string };
  category: 'apartment' | 'house' | 'villa' | 'luxury';
  price: number;
  yearlyMaintenance: number;
  yearlyRentIncome: number;
  condition: number; // 0-100
  isOwned: boolean;
  isRentedOut: boolean;
  isLivingHere: boolean;
}

export interface Vehicle {
  id: string;
  title: { de: string; en: string };
  category: 'bike' | 'scooter' | 'car' | 'sports' | 'luxury';
  price: number;
  yearlyMaintenance: number;
  condition: number; // 0-100
  isOwned: boolean;
}

export interface Loan {
  id: string;
  amount: number;
  remainingAmount: number;
  interestRate: number; // e.g. 0.05
  yearlyPayment: number;
}

export interface Investment {
  type: 'stocks' | 'crypto' | 'gold' | 'real_estate_fund';
  amount: number;
  purchasePrice: number;
  currentValue: number;
}

export interface FinancialStatus {
  bankBalance: number;
  netWorth: number;
  loans: Loan[];
  investments: Record<string, Investment>;
  yearlyIncome: number;
  yearlyExpenses: number;
  yearlyTaxes: number;
}

export type EventCategory = 
  | 'school' 
  | 'family' 
  | 'love' 
  | 'health' 
  | 'career' 
  | 'finance' 
  | 'leisure' 
  | 'misfortune' 
  | 'luck' 
  | 'crime' 
  | 'pets';

export interface EventChoice {
  text: { de: string; en: string };
  effect: (char: Character, log: (msg: { de: string; en: string }, type?: LogEntry['type']) => void) => void;
}

export interface GameEvent {
  id: string;
  title: { de: string; en: string };
  description: { de: string; en: string };
  category: EventCategory;
  minAge: number;
  maxAge: number;
  condition?: (char: Character) => boolean;
  choices: EventChoice[];
}

export interface Achievement {
  id: string;
  title: { de: string; en: string };
  description: { de: string; en: string };
  icon: string;
  category: 'wealth' | 'life' | 'family' | 'career' | 'crime' | 'special';
  unlocked: boolean;
  unlockedAtAge?: number;
  check: (char: Character, stats: MultiLifeStats) => boolean;
}

export interface LogEntry {
  id: string;
  age: number;
  text: string; // Translated string at time of creation
  type: 'info' | 'good' | 'bad' | 'major' | 'death' | 'achievement';
  year: number;
}

export interface CrimeStatus {
  inPrison: boolean;
  prisonYearsRemaining: number;
  crimesCommitted: number;
  timesArrested: number;
  wantedLevel: number; // 0-100
}

export interface Character {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  country: Country;
  startCondition: StartCondition;
  age: number;
  isAlive: boolean;
  causeOfDeath?: { de: string; en: string };
  attributes: Attributes;
  education: EducationStatus;
  career: CareerStatus;
  relationships: Person[];
  properties: Property[];
  vehicles: Vehicle[];
  finances: FinancialStatus;
  crime: CrimeStatus;
  log: LogEntry[];
  unlockedAchievements: string[];
  generation: number;
  parentName?: string;
  illnesses: string[];
}

export interface MultiLifeStats {
  totalLivesPlayed: number;
  totalYearsLived: number;
  highestNetWorth: number;
  totalCrimesCommitted: number;
  totalChildrenHad: number;
  totalDegreesEarned: number;
  oldestAgeReached: number;
  dynastyTree: {
    name: string;
    yearsLived: number;
    netWorth: number;
    jobTitle: string;
    generation: number;
  }[];
}

export interface GameSettings {
  language: 'de' | 'en';
  soundEnabled: boolean;
  autoSave: boolean;
}
