export interface PetSpecies {
  id: string;
  name: { de: string; en: string };
  icon: string;
  price: number;
  yearlyCost: number;
  maxLifespan: number;
  happinessBonus: number;
}

export const PET_SPECIES: PetSpecies[] = [
  {
    id: 'dog_retriever',
    name: { de: 'Golden Retriever (Hund)', en: 'Golden Retriever (Dog)' },
    icon: '🐕',
    price: 1200,
    yearlyCost: 800,
    maxLifespan: 14,
    happinessBonus: 8
  },
  {
    id: 'cat_persian',
    name: { de: 'Perserkatze', en: 'Persian Cat' },
    icon: '🐈',
    price: 800,
    yearlyCost: 500,
    maxLifespan: 16,
    happinessBonus: 6
  },
  {
    id: 'hamster',
    name: { de: 'Goldhamster', en: 'Golden Hamster' },
    icon: '🐹',
    price: 40,
    yearlyCost: 120,
    maxLifespan: 3,
    happinessBonus: 3
  },
  {
    id: 'parrot',
    name: { de: 'Sprechender Papagei (Ara)', en: 'Talking Macaw Parrot' },
    icon: '🦜',
    price: 1500,
    yearlyCost: 400,
    maxLifespan: 50,
    happinessBonus: 7
  },
  {
    id: 'snake',
    name: { de: 'Königspython', en: 'Ball Python Snake' },
    icon: '🐍',
    price: 350,
    yearlyCost: 200,
    maxLifespan: 20,
    happinessBonus: 4
  },
  {
    id: 'horse',
    name: { de: 'Arabisches Vollblut-Pferd', en: 'Arabian Thoroughbred Horse' },
    icon: '🐎',
    price: 12000,
    yearlyCost: 3500,
    maxLifespan: 25,
    happinessBonus: 12
  },
  {
    id: 'tiger_exotic',
    name: { de: 'Exotischer Bengaltiger', en: 'Exotic Bengal Tiger' },
    icon: '🐅',
    price: 75000,
    yearlyCost: 18000,
    maxLifespan: 18,
    happinessBonus: 15
  }
];
