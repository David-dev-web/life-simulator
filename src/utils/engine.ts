import type { Character, LogEntry, MultiLifeStats } from '../types/game';
import { getYearlyRandomEvent } from '../data/events';
import { ACHIEVEMENTS } from '../data/achievements';
import { sound } from './sound';
import { updateStatsOnDeath } from './storage';

export const calculateNetWorth = (char: Character): number => {
  let val = char.finances.bankBalance;
  char.properties.forEach(p => {
    if (p.isOwned) val += p.price * (p.condition / 100);
  });
  char.vehicles.forEach(v => {
    if (v.isOwned) val += v.price * (v.condition / 100);
  });
  Object.values(char.finances.investments).forEach(inv => {
    if (inv) val += inv.currentValue;
  });
  char.finances.loans.forEach(l => {
    val -= l.remainingAmount;
  });
  return Math.round(val);
};

export const addLogEntry = (
  char: Character,
  msg: { de: string; en: string },
  type: LogEntry['type'] = 'info',
  lang: 'de' | 'en' = 'de'
) => {
  const entry: LogEntry = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    age: char.age,
    text: msg[lang] || msg.de,
    type,
    year: new Date().getFullYear() + char.age
  };
  char.log.unshift(entry);
};

export const checkAchievements = (char: Character, stats: MultiLifeStats, lang: 'de' | 'en' = 'de'): string[] => {
  const newlyUnlocked: string[] = [];
  ACHIEVEMENTS.forEach(ach => {
    if (!char.unlockedAchievements.includes(ach.id)) {
      if (ach.check(char, stats)) {
        char.unlockedAchievements.push(ach.id);
        newlyUnlocked.push(ach.title[lang] || ach.title.de);
        addLogEntry(
          char,
          {
            de: `🏆 Erfolg freigeschaltet: "${ach.title.de}" - ${ach.description.de}`,
            en: `🏆 Achievement unlocked: "${ach.title.en}" - ${ach.description.en}`
          },
          'achievement',
          lang
        );
        sound.playAchievement();
      }
    }
  });
  return newlyUnlocked;
};

export const processYearlyAgeUp = (
  char: Character,
  stats: MultiLifeStats,
  lang: 'de' | 'en' = 'de',
  onTriggerEvent?: (event: ReturnType<typeof getYearlyRandomEvent>) => void
): Character => {
  const c = JSON.parse(JSON.stringify(char)) as Character;
  c.age += 1;
  const currentYear = new Date().getFullYear() + c.age;

  sound.playAgeUp();

  // 1. Prison process
  if (c.crime.inPrison) {
    c.crime.prisonYearsRemaining -= 1;
    c.attributes.happiness = Math.max(0, c.attributes.happiness - 15);
    c.attributes.stress = Math.min(100, c.attributes.stress + 10);
    if (c.crime.prisonYearsRemaining <= 0) {
      c.crime.inPrison = false;
      addLogEntry(c, {
        de: '🔓 Du wurdest aus dem Gefängnis entlassen! Versuche nun, ein ehrliches Leben zu führen.',
        en: '🔓 You were released from prison! Try to live an honest life now.'
      }, 'good', lang);
    } else {
      addLogEntry(c, {
        de: `🔒 Du verbringst ein weiteres Jahr im Gefängnis. Noch ${c.crime.prisonYearsRemaining} Jahre übrig.`,
        en: `🔒 You spend another year in prison. ${c.crime.prisonYearsRemaining} years remaining.`
      }, 'bad', lang);
    }
  }

  // 2. Education progressions
  if (c.education.isStudying) {
    c.education.yearsInCurrentLevel += 1;
    c.attributes.intelligence = Math.min(100, c.attributes.intelligence + 3);
    
    if (c.education.currentLevel === 'kindergarten' && c.age >= 6) {
      c.education.completedLevels.push('kindergarten');
      c.education.currentLevel = 'elementary';
      c.education.yearsInCurrentLevel = 0;
      addLogEntry(c, { de: '🎒 Du kommst jetzt in die Grundschule!', en: '🎒 You are now entering Elementary School!' }, 'good', lang);
    } else if (c.education.currentLevel === 'elementary' && c.age >= 10) {
      c.education.completedLevels.push('elementary');
      if (c.attributes.intelligence >= 50 || c.education.grade >= 70) {
        c.education.currentLevel = 'high_school';
        addLogEntry(c, { de: '📚 Du hast es aufs Gymnasium geschafft!', en: '📚 You made it into High School!' }, 'good', lang);
      } else {
        c.education.currentLevel = 'middle_school';
        addLogEntry(c, { de: '🎒 Du wechselst auf die Mittelschule/Realschule.', en: '🎒 You transition to Middle School.' }, 'info', lang);
      }
      c.education.yearsInCurrentLevel = 0;
    } else if ((c.education.currentLevel === 'middle_school' && c.age >= 16) || (c.education.currentLevel === 'high_school' && c.age >= 18)) {
      c.education.completedLevels.push(c.education.currentLevel);
      c.education.isStudying = false;
      addLogEntry(c, { de: '🎓 Du hast deinen Schulabschluss in der Tasche!', en: '🎓 You graduated from school!' }, 'major', lang);
    } else if (c.education.currentLevel === 'vocational' && c.education.yearsInCurrentLevel >= 3) {
      c.education.completedLevels.push('vocational');
      c.education.isStudying = false;
      addLogEntry(c, { de: '🛠️ Du hast deine Berufsausbildung erfolgreich beendet!', en: '🛠️ You completed your vocational training!' }, 'major', lang);
    } else if (c.education.currentLevel === 'university' && c.education.yearsInCurrentLevel >= 4) {
      c.education.completedLevels.push('university');
      c.education.isStudying = false;
      addLogEntry(c, { de: '🎓 Du hast dein Universitätsstudium (Bachelor/Master) erfolgreich abgeschlossen!', en: '🎓 You graduated from University with a degree!' }, 'major', lang);
    } else if (c.education.currentLevel === 'doctorate' && c.education.yearsInCurrentLevel >= 3) {
      c.education.completedLevels.push('doctorate');
      c.education.isStudying = false;
      addLogEntry(c, { de: '📜 Glückwunsch, Herr/Frau Doktor! Du hast deine Promotion abgeschlossen.', en: '📜 Congratulations, Doctor! You completed your PhD.' }, 'major', lang);
    }
  }

  // 3. Career & Finance Progression
  let yearlyIncome = 0;
  if (c.career.currentJob && !c.crime.inPrison) {
    c.career.yearsInJob += 1;
    const baseInc = c.career.salary * c.country.salaryMultiplier;
    yearlyIncome = baseInc;
    c.attributes.stress = Math.min(100, c.attributes.stress + Math.round(c.career.currentJob.stressLevel * 0.3));

    // Check automatic promotion
    if (c.career.currentJob.promotionJobId && c.career.yearsInJob >= (c.career.currentJob.yearsForPromotion || 5) && c.career.performance >= 70) {
      addLogEntry(c, {
        de: `⭐ Hervorragende Leistungen! Du stehst kurz vor einer Beförderung in deinem Job!`,
        en: `⭐ Great performance! You are eligible for a promotion in your job!`
      }, 'good', lang);
    }
  } else if (c.career.hasRetired) {
    yearlyIncome = c.career.pension;
  } else if (c.age >= 18 && !c.education.isStudying && !c.crime.inPrison) {
    // Arbeitslosengeld / Bürgergeld
    yearlyIncome = 4500 * c.country.salaryMultiplier;
  }

  // Calculate taxes and living costs
  const taxes = Math.round(yearlyIncome * c.country.taxRate);
  let baseLivingCost = c.age < 18 ? 0 : Math.round(12000 * c.country.salaryMultiplier);
  if (c.attributes.looks > 80 || c.finances.netWorth > 500000) baseLivingCost = Math.round(baseLivingCost * 1.5); // Luxuriöser Lebensstil

  let propertyMaintenance = 0;
  let rentalIncome = 0;
  c.properties.forEach(p => {
    if (p.isOwned) {
      propertyMaintenance += p.yearlyMaintenance;
      p.condition = Math.max(10, p.condition - 3);
      if (p.isRentedOut) {
        rentalIncome += p.yearlyRentIncome;
      }
    }
  });

  let vehicleMaintenance = 0;
  c.vehicles.forEach(v => {
    if (v.isOwned) {
      vehicleMaintenance += v.yearlyMaintenance;
      v.condition = Math.max(10, v.condition - 5);
    }
  });

  // Loan interest and payments
  let loanPayments = 0;
  c.finances.loans = c.finances.loans.filter(l => {
    loanPayments += l.yearlyPayment;
    l.remainingAmount -= Math.round(l.yearlyPayment * (1 - l.interestRate));
    return l.remainingAmount > 0;
  });

  // Investment changes (Real-time stock simulation)
  Object.keys(c.finances.investments).forEach(key => {
    const inv = c.finances.investments[key];
    if (inv) {
      let changePercent = 0;
      if (inv.type === 'stocks') changePercent = (Math.random() * 0.24) - 0.08; // -8% to +16% average
      if (inv.type === 'crypto') changePercent = (Math.random() * 0.90) - 0.40; // -40% to +50% wild volatility
      if (inv.type === 'gold') changePercent = (Math.random() * 0.12) - 0.03;   // -3% to +9% steady
      if (inv.type === 'real_estate_fund') changePercent = (Math.random() * 0.14) - 0.02; // -2% to +12%
      
      inv.currentValue = Math.max(1, Math.round(inv.currentValue * (1 + changePercent)));
    }
  });

  const totalExpenses = baseLivingCost + taxes + propertyMaintenance + vehicleMaintenance + loanPayments;
  const totalIncome = yearlyIncome + rentalIncome;
  const netChange = totalIncome - totalExpenses;
  c.finances.bankBalance += netChange;
  c.finances.yearlyIncome = totalIncome;
  c.finances.yearlyExpenses = totalExpenses;
  c.finances.yearlyTaxes = taxes;
  c.finances.netWorth = calculateNetWorth(c);

  if (c.finances.bankBalance < -10000 && !c.crime.inPrison) {
    addLogEntry(c, {
      de: `⚠️ Dein Bankkonto ist stark im Minus (${c.finances.bankBalance.toLocaleString()} €)! Die Bank droht mit Pfändung.`,
      en: `⚠️ Your bank account is deep in red (${c.finances.bankBalance.toLocaleString()} €)! The bank threatens foreclosure.`
    }, 'bad', lang);
    c.attributes.stress = Math.min(100, c.attributes.stress + 15);
  }

  // 4. Attribute drift & health check
  if (c.attributes.stress > 70) {
    c.attributes.health = Math.max(0, c.attributes.health - 8);
    c.attributes.energy = Math.max(0, c.attributes.energy - 10);
  } else {
    c.attributes.energy = Math.min(100, c.attributes.energy + 5);
  }

  if (c.age > 45) {
    c.attributes.looks = Math.max(10, c.attributes.looks - (c.age > 70 ? 2 : 1));
  }
  if (c.age > 60) {
    c.attributes.health = Math.max(0, c.attributes.health - Math.floor((c.age - 55) / 5));
  }

  // 5. Relationship aging and interactions
  c.relationships = c.relationships.filter(r => {
    if (!r.isAlive) return false;
    r.age += 1;
    // Natural age decay or pet lifespan
    if (r.type === 'pet') {
      const maxAge = r.petSpecies === 'hamster' ? 3 : r.petSpecies === 'dog_retriever' ? 14 : 18;
      if (r.age >= maxAge && Math.random() > 0.3) {
        addLogEntry(c, {
          de: `🌈 Dein geliebtes Haustier ${r.name} ist im Alter von ${r.age} Jahren friedlich über die Regenbogenbrücke gegangen.`,
          en: `🌈 Your beloved pet ${r.name} crossed the rainbow bridge peacefully at age ${r.age}.`
        }, 'bad', lang);
        c.attributes.happiness = Math.max(0, c.attributes.happiness - 20);
        return false;
      }
    } else if (r.age > 75 && Math.random() < ((r.age - 70) * 0.015)) {
      addLogEntry(c, {
        de: `🕊️ In tiefer Trauer: Dein(e) ${r.name} (${r.type === 'mother' ? 'Mutter' : r.type === 'father' ? 'Vater' : r.type === 'partner' ? 'Partner' : 'Verwandte(r)'}) ist im Alter von ${r.age} Jahren verstorben.`,
        en: `🕊️ In deep sorrow: Your ${r.name} (${r.type}) passed away at the age of ${r.age}.`
      }, 'death', lang);
      c.attributes.happiness = Math.max(0, c.attributes.happiness - 30);
      return false;
    }
    return true;
  });

  // Partner proposal or baby surprise
  const partner = c.relationships.find(r => r.type === 'partner');
  if (partner && partner.relationship > 80 && c.age >= 21 && Math.random() < 0.15) {
    addLogEntry(c, {
      de: `💍 Romantischer Moment: ${partner.name} macht dir einen wunderschönen Heiratsantrag! Checke deinen Beziehungs-Tab!`,
      en: `💍 Romantic moment: ${partner.name} proposes to you! Check your relationships tab!`
    }, 'good', lang);
  }

  // 6. Trigger Random Event
  if (onTriggerEvent && !c.crime.inPrison) {
    const event = getYearlyRandomEvent(c);
    if (event) {
      onTriggerEvent(event);
    }
  }

  // 7. Check for Death
  let isDead = false;
  let cause: { de: string; en: string } | undefined;
  if (c.attributes.health <= 0) {
    isDead = true;
    cause = { de: 'Organversagen und Erschöpfung durch kritischen Gesundheitszustand.', en: 'Organ failure and exhaustion from critical health.' };
  } else if (c.age > 80 && Math.random() < ((c.age - 78) * 0.035)) {
    isDead = true;
    cause = { de: `Friedlich im hohen Alter von ${c.age} Jahren im Schlaf eingeschlafen.`, en: `Passed away peacefully in sleep at the ripe age of ${c.age}.` };
  }

  if (isDead) {
    c.isAlive = false;
    c.causeOfDeath = cause;
    sound.playDeath();
    addLogEntry(c, {
      de: `🖤 Dein Leben hat mit ${c.age} Jahren im Jahr ${currentYear} sein Ende gefunden. Grund: ${cause?.de}`,
      en: `🖤 Your life came to an end at age ${c.age} in ${currentYear}. Cause: ${cause?.en}`
    }, 'death', lang);
    updateStatsOnDeath(c);
  }

  // 8. Check achievements
  checkAchievements(c, stats, lang);

  return c;
};
