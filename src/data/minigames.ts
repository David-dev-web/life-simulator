export interface QuizQuestion {
  question: { de: string; en: string };
  options: { de: string[]; en: string[] };
  correctIndex: number;
}

export const IQ_QUESTIONS: QuizQuestion[] = [
  {
    question: { de: 'Welcher Planet ist der Sonne am nächsten?', en: 'Which planet is closest to the sun?' },
    options: {
      de: ['Venus', 'Merkur', 'Mars', 'Erde'],
      en: ['Venus', 'Mercury', 'Mars', 'Earth']
    },
    correctIndex: 1
  },
  {
    question: { de: 'Wie viele Kontinente gibt es auf der Erde (klassische Zählung)?', en: 'How many continents are there on Earth (standard count)?' },
    options: {
      de: ['5', '6', '7', '8'],
      en: ['5', '6', '7', '8']
    },
    correctIndex: 2
  },
  {
    question: { de: 'Wer schrieb das Drama "Faust"?', en: 'Who wrote the tragedy "Faust"?' },
    options: {
      de: ['Friedrich Schiller', 'Johann Wolfgang von Goethe', 'Bertolt Brecht', 'William Shakespeare'],
      en: ['Friedrich Schiller', 'Johann Wolfgang von Goethe', 'Bertolt Brecht', 'William Shakespeare']
    },
    correctIndex: 1
  },
  {
    question: { de: 'Was ist die Wurzel von 144?', en: 'What is the square root of 144?' },
    options: {
      de: ['11', '12', '13', '14'],
      en: ['11', '12', '13', '14']
    },
    correctIndex: 1
  },
  {
    question: { de: 'Welches chemische Symbol steht für Gold?', en: 'Which chemical symbol stands for Gold?' },
    options: {
      de: ['Ag', 'Fe', 'Au', 'Gd'],
      en: ['Ag', 'Fe', 'Au', 'Gd']
    },
    correctIndex: 2
  },
  {
    question: { de: 'Wie schnell breitet sich das Licht im Vakuum ungefähr aus?', en: 'What is the approximate speed of light in a vacuum?' },
    options: {
      de: ['300.000 km/s', '150.000 km/s', '1.000.000 km/s', '30.000 km/s'],
      en: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '30,000 km/s']
    },
    correctIndex: 0
  },
  {
    question: { de: 'In welchem Jahr fiel die Berliner Mauer?', en: 'In what year did the Berlin Wall fall?' },
    options: {
      de: ['1987', '1989', '1990', '1991'],
      en: ['1987', '1989', '1990', '1991']
    },
    correctIndex: 1
  },
  {
    question: { de: 'Welche Programmiersprache läuft nativ im Webbrowser?', en: 'Which programming language runs natively in the web browser?' },
    options: {
      de: ['Python', 'C++', 'JavaScript', 'Java'],
      en: ['Python', 'C++', 'JavaScript', 'Java']
    },
    correctIndex: 2
  }
];

export interface BurglaryTarget {
  id: string;
  name: { de: string; en: string };
  difficulty: number; // 0-100
  potentialLoot: number;
  riskOfArrest: number; // 0-100
  timeLimitSec: number;
}

export const BURGLARY_TARGETS: BurglaryTarget[] = [
  {
    id: 'kiosk',
    name: { de: 'Kleiner Späti / Kiosk um die Ecke', en: 'Corner Convenience Store' },
    difficulty: 20,
    potentialLoot: 850,
    riskOfArrest: 15,
    timeLimitSec: 10
  },
  {
    id: 'house_rich',
    name: { de: 'Villa in der Reichensiedlung', en: 'Mansion in Rich Neighborhood' },
    difficulty: 50,
    potentialLoot: 12000,
    riskOfArrest: 40,
    timeLimitSec: 8
  },
  {
    id: 'jewelry',
    name: { de: 'Exklusives Juweliergeschäft', en: 'Exclusive Jewelry Store' },
    difficulty: 75,
    potentialLoot: 85000,
    riskOfArrest: 65,
    timeLimitSec: 6
  },
  {
    id: 'bank_vault',
    name: { de: 'Zentralbank-Tresorraum', en: 'Central Bank Vault' },
    difficulty: 92,
    potentialLoot: 1500000,
    riskOfArrest: 85,
    timeLimitSec: 5
  }
];
