import type { Achievement } from '../types/game';

export const ACHIEVEMENTS: Achievement[] = [
  // --- WEALTH ACHIEVEMENTS ---
  {
    id: 'wealth_100k',
    title: { de: 'Gut betucht', en: 'Well-to-Do' },
    description: { de: 'Erreiche ein Nettovermögen von 100.000 €.', en: 'Reach a net worth of €100,000.' },
    icon: '💵',
    category: 'wealth',
    unlocked: false,
    check: (c) => c.finances.netWorth >= 100000
  },
  {
    id: 'wealth_millionaire',
    title: { de: 'Millionär', en: 'Millionaire' },
    description: { de: 'Erreiche ein Nettovermögen von 1.000.000 €.', en: 'Reach a net worth of €1,000,000.' },
    icon: '💰',
    category: 'wealth',
    unlocked: false,
    check: (c) => c.finances.netWorth >= 1000000
  },
  {
    id: 'wealth_10m',
    title: { de: 'Multimillionär', en: 'Multi-Millionaire' },
    description: { de: 'Erreiche ein Nettovermögen von 10.000.000 €.', en: 'Reach a net worth of €10,000,000.' },
    icon: '💎',
    category: 'wealth',
    unlocked: false,
    check: (c) => c.finances.netWorth >= 10000000
  },
  {
    id: 'wealth_100m',
    title: { de: 'Steinreich', en: 'Filthy Rich' },
    description: { de: 'Erreiche ein Nettovermögen von 100.000.000 €.', en: 'Reach a net worth of €100,000,000.' },
    icon: '🏛️',
    category: 'wealth',
    unlocked: false,
    check: (c) => c.finances.netWorth >= 100000000
  },
  {
    id: 'wealth_billionaire',
    title: { de: 'Milliardär', en: 'Billionaire' },
    description: { de: 'Erreiche ein Nettovermögen von 1.000.000.000 €.', en: 'Reach a net worth of €1,000,000,000.' },
    icon: '👑',
    category: 'wealth',
    unlocked: false,
    check: (c) => c.finances.netWorth >= 1000000000
  },
  {
    id: 'prop_first',
    title: { de: 'Den Schlüssel in der Hand', en: 'Keys in Hand' },
    description: { de: 'Kaufe deine erste Immobilie.', en: 'Buy your first real estate property.' },
    icon: '🏠',
    category: 'wealth',
    unlocked: false,
    check: (c) => c.properties.some(p => p.isOwned)
  },
  {
    id: 'prop_villa',
    title: { de: 'Luxusleben', en: 'Luxury Living' },
    description: { de: 'Besitze eine Villa oder Luxusimmobilie.', en: 'Own a villa or luxury property.' },
    icon: '🏖️',
    category: 'wealth',
    unlocked: false,
    check: (c) => c.properties.some(p => p.isOwned && (p.category === 'villa' || p.category === 'luxury'))
  },
  {
    id: 'prop_castle',
    title: { de: 'Schlossherr', en: 'Lord of the Castle' },
    description: { de: 'Kaufe das historische Königsschloss.', en: 'Buy the historic royal castle.' },
    icon: '🏰',
    category: 'wealth',
    unlocked: false,
    check: (c) => c.properties.some(p => p.isOwned && p.id === 'castle_royal')
  },
  {
    id: 'veh_sports',
    title: { de: 'Schnell und wütend', en: 'Fast and Furious' },
    description: { de: 'Besitze einen Sportwagen.', en: 'Own a sports car.' },
    icon: '🏎️',
    category: 'wealth',
    unlocked: false,
    check: (c) => c.vehicles.some(v => v.isOwned && v.category === 'sports')
  },
  {
    id: 'veh_yacht',
    title: { de: 'Ahoi, Kapitän!', en: 'Ahoy, Captain!' },
    description: { de: 'Besitze eine Luxus-Yacht.', en: 'Own a luxury yacht.' },
    icon: '🛥️',
    category: 'wealth',
    unlocked: false,
    check: (c) => c.vehicles.some(v => v.isOwned && v.id === 'luxury_yacht')
  },
  {
    id: 'veh_jet',
    title: { de: 'Über den Wolken', en: 'Above the Clouds' },
    description: { de: 'Besitze einen eigenen Privatjet.', en: 'Own your own private jet.' },
    icon: '✈️',
    category: 'wealth',
    unlocked: false,
    check: (c) => c.vehicles.some(v => v.isOwned && v.id === 'luxury_jet')
  },

  // --- LIFE & AGE ACHIEVEMENTS ---
  {
    id: 'life_18',
    title: { de: 'Endlich volljährig!', en: 'Finally Legal!' },
    description: { de: 'Erreiche das 18. Lebensjahr.', en: 'Reach 18 years of age.' },
    icon: '🎂',
    category: 'life',
    unlocked: false,
    check: (c) => c.age >= 18
  },
  {
    id: 'life_30',
    title: { de: 'Dreißiger-Club', en: 'Thirties Club' },
    description: { de: 'Erreiche das 30. Lebensjahr.', en: 'Reach 30 years of age.' },
    icon: '🥳',
    category: 'life',
    unlocked: false,
    check: (c) => c.age >= 30
  },
  {
    id: 'life_50',
    title: { de: 'Goldenes Jubiläum', en: 'Golden Jubilee' },
    description: { de: 'Erreiche das 50. Lebensjahr.', en: 'Reach 50 years of age.' },
    icon: '🎉',
    category: 'life',
    unlocked: false,
    check: (c) => c.age >= 50
  },
  {
    id: 'life_70',
    title: { de: 'Weise und erfahren', en: 'Wise and Experienced' },
    description: { de: 'Erreiche das 70. Lebensjahr.', en: 'Reach 70 years of age.' },
    icon: '👴',
    category: 'life',
    unlocked: false,
    check: (c) => c.age >= 70
  },
  {
    id: 'life_90',
    title: { de: 'Hörner des Lebens', en: 'Nine Decades' },
    description: { de: 'Erreiche das 90. Lebensjahr.', en: 'Reach 90 years of age.' },
    icon: '🧙‍♂️',
    category: 'life',
    unlocked: false,
    check: (c) => c.age >= 90
  },
  {
    id: 'life_100',
    title: { de: 'Hundertjähriger', en: 'Centenarian' },
    description: { de: 'Erreiche das unglaubliche 100. Lebensjahr.', en: 'Reach the incredible age of 100.' },
    icon: '💯',
    category: 'life',
    unlocked: false,
    check: (c) => c.age >= 100
  },
  {
    id: 'life_110',
    title: { de: 'Unsterbliche Legende', en: 'Immortal Legend' },
    description: { de: 'Erreiche das 110. Lebensjahr (Supercentenarian).', en: 'Reach 110 years of age (Supercentenarian).' },
    icon: '🌟',
    category: 'life',
    unlocked: false,
    check: (c) => c.age >= 110
  },
  {
    id: 'stat_max_health',
    title: { de: 'Kerngesund', en: 'Picture of Health' },
    description: { de: 'Erreiche 100% Gesundheit.', en: 'Reach 100% health.' },
    icon: '❤️',
    category: 'life',
    unlocked: false,
    check: (c) => c.attributes.health >= 100
  },
  {
    id: 'stat_max_happy',
    title: { de: 'Reine Glückseligkeit', en: 'Pure Bliss' },
    description: { de: 'Erreiche 100% Glück.', en: 'Reach 100% happiness.' },
    icon: '😁',
    category: 'life',
    unlocked: false,
    check: (c) => c.attributes.happiness >= 100
  },
  {
    id: 'stat_max_int',
    title: { de: 'Superhirn & Genie', en: 'Mastermind & Genius' },
    description: { de: 'Erreiche 100% Intelligenz.', en: 'Reach 100% intelligence.' },
    icon: '🧠',
    category: 'life',
    unlocked: false,
    check: (c) => c.attributes.intelligence >= 100
  },
  {
    id: 'stat_max_looks',
    title: { de: 'Makellose Schönheit', en: 'Flawless Beauty' },
    description: { de: 'Erreiche 100% Aussehen.', en: 'Reach 100% looks.' },
    icon: '✨',
    category: 'life',
    unlocked: false,
    check: (c) => c.attributes.looks >= 100
  },
  {
    id: 'stat_max_karma',
    title: { de: 'Heiliger Geist', en: 'Saintly Soul' },
    description: { de: 'Erreiche 100% Karma durch gutes Verhalten.', en: 'Reach 100% karma through good deeds.' },
    icon: '🕊️',
    category: 'life',
    unlocked: false,
    check: (c) => c.attributes.karma >= 100
  },

  // --- FAMILY & RELATIONSHIP ACHIEVEMENTS ---
  {
    id: 'fam_married',
    title: { de: 'Den Bund fürs Leben', en: 'Tying the Knot' },
    description: { de: 'Heirate und führe eine Ehe.', en: 'Get married and have a spouse.' },
    icon: '💍',
    category: 'family',
    unlocked: false,
    check: (c) => c.relationships.some(r => r.type === 'spouse')
  },
  {
    id: 'fam_1_child',
    title: { de: 'Elternglück', en: 'Parenthood' },
    description: { de: 'Bekomme oder adoptiere dein erstes Kind.', en: 'Have or adopt your first child.' },
    icon: '👶',
    category: 'family',
    unlocked: false,
    check: (c) => c.relationships.some(r => r.type === 'child')
  },
  {
    id: 'fam_3_children',
    title: { de: 'Lebhafte Familie', en: 'Lively Family' },
    description: { de: 'Habe mindestens 3 Kinder in einem Leben.', en: 'Have at least 3 children in one life.' },
    icon: '👨‍👩‍👧‍👦',
    category: 'family',
    unlocked: false,
    check: (c) => c.relationships.filter(r => r.type === 'child').length >= 3
  },
  {
    id: 'fam_5_children',
    title: { de: 'Großfamilie', en: 'Big Family' },
    description: { de: 'Habe mindestens 5 Kinder in einem Leben.', en: 'Have at least 5 children in one life.' },
    icon: '🏫',
    category: 'family',
    unlocked: false,
    check: (c) => c.relationships.filter(r => r.type === 'child').length >= 5
  },
  {
    id: 'fam_pet',
    title: { de: 'Tierfreund', en: 'Animal Lover' },
    description: { de: 'Adoptiere ein Haustier.', en: 'Adopt a pet.' },
    icon: '🐾',
    category: 'family',
    unlocked: false,
    check: (c) => c.relationships.some(r => r.type === 'pet')
  },
  {
    id: 'fam_exotic_pet',
    title: { de: 'Tiger-König', en: 'Tiger King' },
    description: { de: 'Halte einen exotischen Bengaltiger als Haustier.', en: 'Keep an exotic Bengal Tiger as a pet.' },
    icon: '🐅',
    category: 'family',
    unlocked: false,
    check: (c) => c.relationships.some(r => r.type === 'pet' && r.petSpecies === 'tiger_exotic')
  },

  // --- CAREER & EDUCATION ACHIEVEMENTS ---
  {
    id: 'edu_highschool',
    title: { de: 'Abiturientenfeuer', en: 'High School Grad' },
    description: { de: 'Schließe das Gymnasium erfolgreich ab.', en: 'Successfully graduate from High School.' },
    icon: '🎓',
    category: 'career',
    unlocked: false,
    check: (c) => c.education.completedLevels.includes('high_school')
  },
  {
    id: 'edu_uni',
    title: { de: 'Akademiker', en: 'University Grad' },
    description: { de: 'Schließe ein Universitätsstudium ab.', en: 'Complete a university degree.' },
    icon: '📜',
    category: 'career',
    unlocked: false,
    check: (c) => c.education.completedLevels.includes('university')
  },
  {
    id: 'edu_phd',
    title: { de: 'Herr/Frau Doktor', en: 'Doctorate Degree' },
    description: { de: 'Erwerbe einen Doktortitel (Promotion).', en: 'Earn a Doctorate / PhD degree.' },
    icon: '🔬',
    category: 'career',
    unlocked: false,
    check: (c) => c.education.completedLevels.includes('doctorate')
  },
  {
    id: 'car_first_job',
    title: { de: 'Im Berufsleben angekommen', en: 'Entering the Workforce' },
    description: { de: 'Beginne deinen ersten Job.', en: 'Start your first job.' },
    icon: 'briefcase',
    category: 'career',
    unlocked: false,
    check: (c) => !!c.career.currentJob || c.career.jobHistory.length > 0
  },
  {
    id: 'car_100k_salary',
    title: { de: 'Sechstelliges Gehalt', en: 'Six-Figure Salary' },
    description: { de: 'Verdiene ein Jahresgehalt von mindestens 100.000 €.', en: 'Earn an annual salary of at least €100,000.' },
    icon: '📈',
    category: 'career',
    unlocked: false,
    check: (c) => c.career.salary >= 100000
  },
  {
    id: 'car_500k_salary',
    title: { de: 'Topverdiener der Nation', en: 'National Top Earner' },
    description: { de: 'Verdiene ein Jahresgehalt von mindestens 500.000 €.', en: 'Earn an annual salary of at least €500,000.' },
    icon: '🚀',
    category: 'career',
    unlocked: false,
    check: (c) => c.career.salary >= 500000
  },
  {
    id: 'car_ceo',
    title: { de: 'An der Spitze', en: 'At the Very Top' },
    description: { de: 'Werde Geschäftsführer (CEO) oder Wirtschaftsmagnat.', en: 'Become a CEO or Business Tycoon.' },
    icon: '🏢',
    category: 'career',
    unlocked: false,
    check: (c) => !!c.career.currentJob && (c.career.currentJob.id === 'biz_ceo' || c.career.currentJob.id === 'biz_tycoon')
  },
  {
    id: 'car_president',
    title: { de: 'Staatsoberhaupt', en: 'Head of State' },
    description: { de: 'Werde Bundeskanzler oder Staatspräsident.', en: 'Become President or Chancellor of the country.' },
    icon: '🏛️',
    category: 'career',
    unlocked: false,
    check: (c) => !!c.career.currentJob && c.career.currentJob.id === 'politician_president'
  },
  {
    id: 'car_astronaut',
    title: { de: 'Zu den Sternen', en: 'To the Stars' },
    description: { de: 'Werde Astronaut oder Mars-Kolonie Kommandant.', en: 'Become an Astronaut or Mars Colony Commander.' },
    icon: '🚀',
    category: 'career',
    unlocked: false,
    check: (c) => !!c.career.currentJob && (c.career.currentJob.id === 'astronaut' || c.career.currentJob.id === 'mars_pioneer')
  },
  {
    id: 'car_oscar',
    title: { de: 'Hollywood-Legende', en: 'Hollywood Legend' },
    description: { de: 'Werde Oscar-gefeierter Leinwandstar.', en: 'Become an Oscar-winning acting legend.' },
    icon: '🎬',
    category: 'career',
    unlocked: false,
    check: (c) => !!c.career.currentJob && c.career.currentJob.id === 'actor_oscar'
  },
  {
    id: 'car_nobel',
    title: { de: 'Wissenschaftlicher Ruhm', en: 'Scientific Glory' },
    description: { de: 'Gewinne den Nobelpreis als Forscher.', en: 'Win the Nobel Prize as a scientist.' },
    icon: '🏅',
    category: 'career',
    unlocked: false,
    check: (c) => !!c.career.currentJob && c.career.currentJob.id === 'sci_nobel'
  },
  {
    id: 'car_retire',
    title: { de: 'Garantierte Rente', en: 'Golden Years' },
    description: { de: 'Gehe wohlverdient in den Ruhestand.', en: 'Retire comfortably after a long career.' },
    icon: '🌴',
    category: 'career',
    unlocked: false,
    check: (c) => c.career.hasRetired
  },

  // --- CRIME ACHIEVEMENTS ---
  {
    id: 'crime_first',
    title: { de: 'Der erste Fehltritt', en: 'First Offense' },
    description: { de: 'Begehe dein erstes Verbrechen im Kriminalitätssystem.', en: 'Commit your first crime in the criminal system.' },
    icon: '🦹',
    category: 'crime',
    unlocked: false,
    check: (c) => c.crime.crimesCommitted >= 1
  },
  {
    id: 'crime_master_thief',
    title: { de: 'Meister-Dieb', en: 'Master Thief' },
    description: { de: 'Begehe erfolgreich 10 Verbrechen, ohne gefasst zu werden.', en: 'Successfully commit 10 crimes without getting caught.' },
    icon: '🥷',
    category: 'crime',
    unlocked: false,
    check: (c) => c.crime.crimesCommitted >= 10 && c.crime.timesArrested === 0
  },
  {
    id: 'crime_prison',
    title: { de: 'Hinter Gitter', en: 'Behind Bars' },
    description: { de: 'Verbringe mindestens ein Jahr im Gefängnis.', en: 'Spend at least one year in prison.' },
    icon: '🔒',
    category: 'crime',
    unlocked: false,
    check: (c) => c.crime.inPrison || c.crime.timesArrested > 0
  },
  {
    id: 'crime_bank_rob',
    title: { de: 'Der große Coup', en: 'The Great Heist' },
    description: { de: 'Knacke erfolgreich den Zentralbank-Tresorraum.', en: 'Successfully crack the Central Bank Vault.' },
    icon: '💰',
    category: 'crime',
    unlocked: false,
    check: (c) => c.unlockedAchievements.includes('crime_bank_rob')
  },

  // --- SPECIAL & STATS ACHIEVEMENTS ---
  {
    id: 'spec_dynasty_3',
    title: { de: 'Familiendynastie', en: 'Family Dynasty' },
    description: { de: 'Führe eine Familie über 3 ununterbrochene Generationen.', en: 'Lead a family across 3 unbroken generations.' },
    icon: '🌳',
    category: 'special',
    unlocked: false,
    check: (c, stats) => c.generation >= 3 || stats.dynastyTree.length >= 3
  },
  {
    id: 'spec_dynasty_5',
    title: { de: 'Ewiges Erbe', en: 'Eternal Heritage' },
    description: { de: 'Führe eine Familie über 5 Generationen.', en: 'Lead a family across 5 generations.' },
    icon: '👑',
    category: 'special',
    unlocked: false,
    check: (c, stats) => c.generation >= 5 || stats.dynastyTree.length >= 5
  },
  {
    id: 'spec_10_lives',
    title: { de: 'Reinkarnation', en: 'Reincarnation' },
    description: { de: 'Spiele insgesamt 10 Leben im Spiel.', en: 'Play a total of 10 lives in the game.' },
    icon: '🔄',
    category: 'special',
    unlocked: false,
    check: (_c, stats) => stats.totalLivesPlayed >= 10
  },
  {
    id: 'spec_1000_years',
    title: { de: 'Ein Jahrtausend gelebt', en: 'A Millennium Lived' },
    description: { de: 'Sammle über alle Leben hinweg 1.000 gelebte Jahre.', en: 'Accumulate 1,000 lived years across all lives.' },
    icon: '⏳',
    category: 'special',
    unlocked: false,
    check: (_c, stats) => stats.totalYearsLived >= 1000
  },
  {
    id: 'spec_invest_profit',
    title: { de: 'Wolf of Wall Street', en: 'Wolf of Wall Street' },
    description: { de: 'Besitze Aktien oder Investitionen im Wert von über 500.000 €.', en: 'Hold stocks or investments worth over €500,000.' },
    icon: '📈',
    category: 'special',
    unlocked: false,
    check: (c) => Object.values(c.finances.investments).reduce((acc, inv) => acc + (inv?.currentValue || 0), 0) >= 500000
  },
  {
    id: 'spec_survive_koma',
    title: { de: 'Vom Tod auferstanden', en: 'Back from the Brink' },
    description: { de: 'Überlebe eine Situation mit unter 5% Gesundheit und erhole dich wieder.', en: 'Survive a situation with under 5% health and recover.' },
    icon: '🏥',
    category: 'special',
    unlocked: false,
    check: (c) => c.unlockedAchievements.includes('spec_survive_koma')
  }
];
