import type { GameEvent, Character } from '../types/game';

// Comprehensive Random Events covering all life stages and 11 categories
export const STATIC_EVENTS: GameEvent[] = [
  // --- KINDERGARTEN & CHILDHOOD (0-9) ---
  {
    id: 'child_sandcastle',
    title: { de: 'Zerstörte Sandburg', en: 'Destroyed Sandcastle' },
    description: { de: 'Ein älteres Kind tritt deine sorgfältig gebaute Sandburg im Kindergarten kaputt und lacht dich aus.', en: 'An older kid kicks down your carefully built sandcastle at kindergarten and laughs at you.' },
    category: 'school',
    minAge: 3,
    maxAge: 6,
    choices: [
      {
        text: { de: 'Mit Sand werfen und ihn treten!', en: 'Throw sand and kick him!' },
        effect: (c, log) => {
          c.attributes.discipline = Math.max(0, c.attributes.discipline - 10);
          c.attributes.happiness = Math.max(0, c.attributes.happiness - 5);
          log({ de: 'Du hast dich gerächt, wurdest aber von der Erzieherin in die Ecke gestellt.', en: 'You got revenge, but the teacher put you in time-out.' }, 'bad');
        }
      },
      {
        text: { de: 'Weinen und die Erzieherin rufen.', en: 'Cry and tell the teacher.' },
        effect: (c, log) => {
          c.attributes.stress = Math.min(100, c.attributes.stress + 5);
          log({ de: 'Die Erzieherin schimpft mit dem Jungen und hilft dir beim Neubau.', en: 'The teacher scolded the boy and helped you rebuild.' }, 'good');
        }
      },
      {
        text: { de: 'Ignorieren und eine noch bessere Burg bauen.', en: 'Ignore him and build an even better castle.' },
        effect: (c, log) => {
          c.attributes.intelligence = Math.min(100, c.attributes.intelligence + 5);
          c.attributes.discipline = Math.min(100, c.attributes.discipline + 8);
          log({ de: 'Deine neue Burg ist das Wunderwerk des Spielplatzes!', en: 'Your new castle is the masterpiece of the playground!' }, 'good');
        }
      }
    ]
  },
  {
    id: 'child_broker_glass',
    title: { de: 'Die zerbrochene Vase', en: 'The Broken Vase' },
    description: { de: 'Beim Fußballspielen im Wohnzimmer hast du die teure chinesische Porzellanvase deiner Mutter zerschmettert.', en: 'While playing soccer in the living room, you smashed your mother\'s expensive porcelain vase.' },
    category: 'family',
    minAge: 5,
    maxAge: 11,
    choices: [
      {
        text: { de: 'Sofort die Wahrheit sagen und dich entschuldigen.', en: 'Tell the truth immediately and apologize.' },
        effect: (c, log) => {
          c.attributes.karma = Math.min(100, c.attributes.karma + 10);
          c.attributes.discipline = Math.min(100, c.attributes.discipline + 5);
          if (c.relationships[0]) c.relationships[0].relationship = Math.max(0, c.relationships[0].relationship - 5);
          log({ de: 'Deine Mutter war traurig, aber lobte deine Ehrlichkeit.', en: 'Your mother was sad, but praised your honesty.' }, 'info');
        }
      },
      {
        text: { de: 'Die Schuld auf das Haustier oder den Wind schieben.', en: 'Blame it on the pet or the wind.' },
        effect: (c, log) => {
          c.attributes.karma = Math.max(0, c.attributes.karma - 12);
          if (Math.random() > 0.5) {
            log({ de: 'Deine Eltern haben dir geglaubt! Du bist ungeschoren davongekommen.', en: 'Your parents believed you! You got away with it.' }, 'good');
          } else {
            c.attributes.happiness = Math.max(0, c.attributes.happiness - 15);
            log({ de: 'Du wurdest bei der Lüge ertappt und hast 2 Wochen Hausarrest bekommen.', en: 'You were caught lying and got grounded for 2 weeks.' }, 'bad');
          }
        }
      }
    ]
  },
  {
    id: 'school_math_competition',
    title: { de: 'Nationale Mathematik-Olympiade', en: 'National Math Olympiad' },
    description: { de: 'Dein Mathelehrer schlägt dich vor, die Schule bei der nationalen Mathematik-Olympiade zu vertreten.', en: 'Your math teacher recommends you to represent the school at the National Math Olympiad.' },
    category: 'school',
    minAge: 10,
    maxAge: 17,
    choices: [
      {
        text: { de: 'Wochenlang intensiv lernen und antreten!', en: 'Study hard for weeks and compete!' },
        effect: (c, log) => {
          if (c.attributes.intelligence >= 60 || c.attributes.discipline >= 70) {
            c.attributes.intelligence = Math.min(100, c.attributes.intelligence + 12);
            c.attributes.happiness = Math.min(100, c.attributes.happiness + 15);
            c.education.grade = Math.min(100, c.education.grade + 15);
            log({ de: 'Du hast den 1. Platz gewonnen! Deine Lehrer und Eltern sind extrem stolz.', en: 'You won 1st place! Your teachers and parents are extremely proud.' }, 'good');
          } else {
            c.attributes.stress = Math.min(100, c.attributes.stress + 15);
            log({ de: 'Die Aufgaben waren zu schwer. Du bist im Mittelfeld gelandet, hast aber viel gelernt.', en: 'The problems were too hard. You finished middle of the pack, but learned a lot.' }, 'info');
          }
        }
      },
      {
        text: { de: 'Ablehnen – Lieber mit Freunden chillen.', en: 'Decline – Better to chill with friends.' },
        effect: (c, log) => {
          c.attributes.happiness = Math.min(100, c.attributes.happiness + 8);
          c.attributes.discipline = Math.max(0, c.attributes.discipline - 5);
          log({ de: 'Du hattest ein entspanntes Wochenende, aber dein Lehrer war enttäuscht.', en: 'You had a relaxing weekend, but your teacher was disappointed.' }, 'info');
        }
      }
    ]
  },
  {
    id: 'school_bully_confrontation',
    title: { de: 'Der Schulhof-Tyrann', en: 'The Schoolyard Bully' },
    description: { de: 'Ein berüchtigter Schulschläger fordert dein Pausenbrot und dein Taschengeld vor allen anderen ein.', en: 'A notorious bully demands your lunch and pocket money in front of everyone.' },
    category: 'school',
    minAge: 11,
    maxAge: 16,
    choices: [
      {
        text: { de: 'Ihm mutig ins Gesicht blicken und dich wehren!', en: 'Face him bravely and fight back!' },
        effect: (c, log) => {
          if (c.attributes.health >= 60 || c.attributes.energy >= 70) {
            c.attributes.happiness = Math.min(100, c.attributes.happiness + 20);
            log({ de: 'Du hast den Schläger mit einem schnellen Griff zu Boden geschickt. Ab jetzt hast du Respekt auf dem Schulhof!', en: 'You took the bully down with a quick move. You now have respect in the schoolyard!' }, 'good');
          } else {
            c.attributes.health = Math.max(0, c.attributes.health - 15);
            c.attributes.happiness = Math.max(0, c.attributes.happiness - 10);
            log({ de: 'Du wurdest verprügelt und musstest zum Schularzt, hast aber Rückgrat bewiesen.', en: 'You got beaten up and had to visit the school nurse, but showed backbone.' }, 'bad');
          }
        }
      },
      {
        text: { de: 'Das Geld geben und weglaufen.', en: 'Give the money and run away.' },
        effect: (c, log) => {
          c.finances.bankBalance = Math.max(0, c.finances.bankBalance - 20);
          c.attributes.happiness = Math.max(0, c.attributes.happiness - 15);
          c.attributes.stress = Math.min(100, c.attributes.stress + 10);
          log({ de: 'Du bist dem Ärger entgangen, fühlst dich aber gedemütigt.', en: 'You avoided trouble, but feel humiliated.' }, 'bad');
        }
      }
    ]
  },

  // --- TEENAGER & YOUNG ADULT (14-25) ---
  {
    id: 'love_first_crush',
    title: { de: 'Der erste Schwarm', en: 'First Crush' },
    description: { de: 'Du bist unsterblich in jemanden aus deiner Parallelklasse verliebt. Auf der Schulparty stehen die Chancen gut.', en: 'You have a massive crush on someone from the other class. At the school party, chances look good.' },
    category: 'love',
    minAge: 14,
    maxAge: 19,
    choices: [
      {
        text: { de: 'Hingehen und der Person deine Gefühle gestehen!', en: 'Go over and confess your feelings!' },
        effect: (c, log) => {
          if (c.attributes.looks >= 50 || Math.random() > 0.4) {
            c.attributes.happiness = Math.min(100, c.attributes.happiness + 25);
            log({ de: 'Volltreffer! Die Gefühle beruhen auf Gegenseitigkeit. Ihr seid jetzt ein Paar!', en: 'Jackpot! The feelings are mutual. You are now a couple!' }, 'good');
            c.relationships.push({
              id: 'partner_' + Date.now(),
              name: 'Alex',
              type: 'partner',
              gender: c.gender === 'male' ? 'female' : 'male',
              age: c.age,
              relationship: 80,
              health: 90,
              looks: 75,
              intelligence: 70,
              isAlive: true
            });
          } else {
            c.attributes.happiness = Math.max(0, c.attributes.happiness - 20);
            log({ de: 'Du wurdest leider vor allen Freunden gekorbt. Autsch!', en: 'You got rejected in front of all your friends. Ouch!' }, 'bad');
          }
        }
      },
      {
        text: { de: 'Schüchtern in der Ecke stehen und nur beobachten.', en: 'Stand shyly in the corner and just watch.' },
        effect: (c, log) => {
          c.attributes.stress = Math.min(100, c.attributes.stress + 5);
          log({ de: 'Jemand anderes hat deinen Schwarm zum Tanzen aufgefordert. Du hast deine Chance verpasst.', en: 'Someone else asked your crush to dance. You missed your chance.' }, 'info');
        }
      }
    ]
  },
  {
    id: 'leisure_crypto_hype',
    title: { de: 'Der Krypto-Geheimtipp', en: 'The Secret Crypto Tip' },
    description: { de: 'Ein alter Kumpel erzählt dir begeistert von der neuen Kryptowährung "MoonDoge-X" und schwört, dass sich der Wert verzehnfachen wird.', en: 'An old buddy enthusiastically tells you about a new cryptocurrency "MoonDoge-X" and swears it will 10x.' },
    category: 'finance',
    minAge: 18,
    maxAge: 45,
    choices: [
      {
        text: { de: '2.000 € investieren – No Risk, No Fun!', en: 'Invest €2,000 – No risk, no fun!' },
        effect: (c, log) => {
          if (c.finances.bankBalance >= 2000) {
            c.finances.bankBalance -= 2000;
            if (Math.random() > 0.6) {
              const profit = 18000;
              c.finances.bankBalance += profit;
              c.attributes.happiness = Math.min(100, c.attributes.happiness + 30);
              log({ de: `Wahnsinn! MoonDoge-X ist durch die Decke gegangen! Du machst ${profit} € Gewinn!`, en: `Insane! MoonDoge-X skyrocketed! You made ${profit} € profit!` }, 'good');
            } else {
              c.attributes.happiness = Math.max(0, c.attributes.happiness - 15);
              log({ de: 'Totalverlust! Die Gründer der Krypto-Münze sind mit dem Geld nach Bali abgetaucht (Rug Pull).', en: 'Total loss! The founders ran off to Bali with the money (Rug Pull).' }, 'bad');
            }
          } else {
            log({ de: 'Du hattest nicht genug Geld auf dem Konto für dieses Abenteuer.', en: 'You did not have enough money in your account for this adventure.' }, 'info');
          }
        }
      },
      {
        text: { de: 'Lachen und dankend ablehnen.', en: 'Laugh and politely decline.' },
        effect: (c, log) => {
          c.attributes.intelligence = Math.min(100, c.attributes.intelligence + 2);
          log({ de: 'Zwei Wochen später war MoonDoge-X wertlos. Deine Skepsis hat dich vor einem Verlust bewahrt.', en: 'Two weeks later MoonDoge-X was worthless. Your skepticism saved you from a loss.' }, 'info');
        }
      }
    ]
  },
  {
    id: 'career_headhunter',
    title: { de: 'Abwerbeangebot eines Konkurrenten', en: 'Headhunter Offer from Competitor' },
    description: { de: 'Ein hochrangiger Headhunter ruft dich an: Ein konkurrierendes Unternehmen bietet dir eine ähnliche Position mit 30% mehr Gehalt an.', en: 'A top headhunter calls: A rival company offers you a similar position with a 30% salary raise.' },
    category: 'career',
    minAge: 22,
    maxAge: 60,
    condition: (c) => !!c.career.currentJob,
    choices: [
      {
        text: { de: 'Das Angebot sofort annehmen und kündigen!', en: 'Accept the offer immediately and resign!' },
        effect: (c, log) => {
          c.career.salary = Math.round(c.career.salary * 1.3);
          c.attributes.happiness = Math.min(100, c.attributes.happiness + 15);
          c.attributes.stress = Math.min(100, c.attributes.stress + 10);
          log({ de: `Du hast den Job gewechselt! Dein neues Gehalt beträgt jetzt ${c.career.salary.toLocaleString()} €!`, en: `You switched jobs! Your new salary is now ${c.career.salary.toLocaleString()} €!` }, 'good');
        }
      },
      {
        text: { de: 'Das Angebot nutzen, um beim Chef eine Gehaltserhöhung zu verhandeln.', en: 'Use the offer to negotiate a raise with your current boss.' },
        effect: (c, log) => {
          if (c.career.performance >= 70 || c.attributes.intelligence >= 75) {
            c.career.salary = Math.round(c.career.salary * 1.25);
            log({ de: `Dein Chef wollte dich nicht verlieren und hat dein Gehalt auf ${c.career.salary.toLocaleString()} € erhöht!`, en: `Your boss didn't want to lose you and raised your salary to ${c.career.salary.toLocaleString()} €!` }, 'good');
          } else {
            log({ de: 'Dein Chef reagierte kühl: "Reisende soll man nicht aufhalten." Du bist in alter Position geblieben.', en: 'Your boss reacted coldly: "Don\'t let the door hit you." You stayed in your old position.' }, 'bad');
          }
        }
      }
    ]
  },
  {
    id: 'health_burnout_warning',
    title: { de: 'Alarmzeichen des Körpers', en: 'Body Alarm Signs' },
    description: { de: 'Aufgrund von chronischem Überarbeiten und Schlafmangel brichst du im Büro mit Herzrasen und Schwindel kurz zusammen.', en: 'Due to chronic overwork and sleep deprivation, you briefly collapse at the office with heart palpitations.' },
    category: 'health',
    minAge: 25,
    maxAge: 65,
    condition: (c) => c.attributes.stress > 65 || c.attributes.energy < 25,
    choices: [
      {
        text: { de: 'In den Urlaub fahren und 2 Wochen Wellness machen (-2.500 €).', en: 'Go on vacation and do 2 weeks of wellness (-2,500 €).' },
        effect: (c, log) => {
          c.finances.bankBalance -= 2500;
          c.attributes.stress = Math.max(0, c.attributes.stress - 40);
          c.attributes.energy = Math.min(100, c.attributes.energy + 50);
          c.attributes.health = Math.min(100, c.attributes.health + 15);
          log({ de: 'Der Urlaub tat fantastisch gut! Du fühlst dich wie neu geboren.', en: 'The vacation felt amazing! You feel like a new person.' }, 'good');
        }
      },
      {
        text: { de: 'Starke Energy-Drinks trinken und weiterarbeiten!', en: 'Drink strong energy drinks and keep working!' },
        effect: (c, log) => {
          c.attributes.health = Math.max(0, c.attributes.health - 25);
          c.attributes.stress = Math.min(100, c.attributes.stress + 20);
          if (c.attributes.health < 20) {
            log({ de: 'Du bist mit einem schweren Burnout im Krankenhaus gelandet! (-5.000 € Arztkosten).', en: 'You ended up in the hospital with severe burnout! (-5,000 € medical bills).' }, 'bad');
            c.finances.bankBalance -= 5000;
          } else {
            log({ de: 'Du hast dich durchgebissen, aber deine Gesundheit hat stark gelitten.', en: 'You pushed through, but your health suffered greatly.' }, 'bad');
          }
        }
      }
    ]
  },

  // --- LUCK & MISFORTUNE (All Ages) ---
  {
    id: 'luck_lottery_scratch',
    title: { de: 'Der magische Rubbellos-Fund', en: 'The Magic Scratchcard Find' },
    description: { de: 'Du findest auf dem Gehweg ein unzerkratztes Rubbellos. Mit einer Münze rubbelst du die Felder frei...', en: 'You find an unscratched lottery ticket on the sidewalk. With a coin you scratch off the fields...' },
    category: 'luck',
    minAge: 12,
    maxAge: 99,
    choices: [
      {
        text: { de: 'Rubbeln und das Beste hoffen!', en: 'Scratch it and hope for the best!' },
        effect: (c, log) => {
          const rand = Math.random();
          if (rand > 0.9) {
            const win = 50000;
            c.finances.bankBalance += win;
            c.attributes.happiness = Math.min(100, c.attributes.happiness + 40);
            log({ de: `HAUPTGEWINN! Du hast ${win.toLocaleString()} € auf dem Rubbellos gewonnen!`, en: `JACKPOT! You won ${win.toLocaleString()} € on the scratchcard!` }, 'good');
          } else if (rand > 0.5) {
            const win = 100;
            c.finances.bankBalance += win;
            log({ de: `Kleingewinn! Du hast ${win} € gewonnen und dir davon etwas Gutes gegönnt.`, en: `Small win! You won ${win} € and treated yourself.` }, 'good');
          } else {
            log({ de: 'Leider eine Niete. Trotzdem spannend!', en: 'Unfortunately a dud. Exciting anyway!' }, 'info');
          }
        }
      }
    ]
  },
  {
    id: 'misfortune_identity_theft',
    title: { de: 'Digitaler Identitätsdiebstahl', en: 'Digital Identity Theft' },
    description: { de: 'Cyberkriminelle haben dein E-Mail-Konto gehackt und auf deinen Namen Online-Bestellungen getätigt.', en: 'Cybercriminals hacked your email account and placed online orders in your name.' },
    category: 'misfortune',
    minAge: 18,
    maxAge: 85,
    choices: [
      {
        text: { de: 'Einen Spezialanwalt einschalten (-1.500 €).', en: 'Hire a specialist lawyer (-1,500 €).' },
        effect: (c, log) => {
          c.finances.bankBalance -= 1500;
          c.attributes.stress = Math.min(100, c.attributes.stress + 10);
          log({ de: 'Der Anwalt konnte alle Forderungen abwehren. Deine Kreditwürdigkeit ist gerettet.', en: 'The lawyer successfully defended against all claims. Your credit score is saved.' }, 'info');
        }
      },
      {
        text: { de: 'Versuchen, das Problem selbst mit dem Kundenservice zu lösen.', en: 'Try to solve the issue yourself with customer service.' },
        effect: (c, log) => {
          if (c.attributes.intelligence >= 70) {
            log({ de: 'Mit kluger Argumentation und Beweisen konntest du die Konten sperren lassen.', en: 'With clever argumentation and proof you got the accounts blocked.' }, 'good');
          } else {
            const loss = 3500;
            c.finances.bankBalance -= loss;
            c.attributes.stress = Math.min(100, c.attributes.stress + 25);
            log({ de: `Du musstest für den Schaden von ${loss.toLocaleString()} € aufkommen!`, en: `You had to pay for the damage of ${loss.toLocaleString()} €!` }, 'bad');
          }
        }
      }
    ]
  },
  {
    id: 'crime_found_wallet',
    title: { de: 'Die dicke Brieftasche', en: 'The Thick Wallet' },
    description: { de: 'Auf dem Sitz der U-Bahn findest du eine Herren-Brieftasche. Darin stecken 1.500 € in bar und ein Ausweis.', en: 'On the subway seat you find a man\'s wallet containing €1,500 in cash and an ID card.' },
    category: 'crime',
    minAge: 14,
    maxAge: 90,
    choices: [
      {
        text: { de: 'Das Geld einstecken und die Geldbörse wegschmeißen!', en: 'Pocket the money and throw away the wallet!' },
        effect: (c, log) => {
          c.finances.bankBalance += 1500;
          c.attributes.karma = Math.max(0, c.attributes.karma - 30);
          c.crime.crimesCommitted += 1;
          log({ de: 'Du bist um 1.500 € reicher, aber dein Gewissen plagt dich ein wenig.', en: 'You are 1,500 € richer, but your conscience nags you a bit.' }, 'bad');
        }
      },
      {
        text: { de: 'Die Geldbörse beim Fundbüro oder Eigentümer abgeben.', en: 'Return the wallet to the lost & found or owner.' },
        effect: (c, log) => {
          c.attributes.karma = Math.min(100, c.attributes.karma + 25);
          c.attributes.happiness = Math.min(100, c.attributes.happiness + 10);
          c.finances.bankBalance += 150; // Finderlohn
          log({ de: 'Der Besitzer fiel dir vor Dankbarkeit um den Hals und gab dir 150 € Finderlohn!', en: 'The owner hugged you out of gratitude and gave you a 150 € finder\'s fee!' }, 'good');
        }
      }
    ]
  },
  {
    id: 'pets_stray_cat',
    title: { de: 'Die streunende Katze', en: 'The Stray Cat' },
    description: { de: 'Vor deiner Haustür sitzt im Regen eine kleine, durchnässte streunende Katze und maunzt dich leise an.', en: 'A small, soaking wet stray cat sits outside your front door in the rain and meows softly at you.' },
    category: 'pets',
    minAge: 10,
    maxAge: 90,
    choices: [
      {
        text: { de: 'Sie hereinholen, trockenrubbeln und adoptieren!', en: 'Bring her in, dry her off and adopt her!' },
        effect: (c, log) => {
          c.attributes.happiness = Math.min(100, c.attributes.happiness + 20);
          c.attributes.karma = Math.min(100, c.attributes.karma + 15);
          c.relationships.push({
            id: 'pet_stray_' + Date.now(),
            name: 'Mimi (Findelkind)',
            type: 'pet',
            gender: 'female',
            age: 1,
            relationship: 95,
            health: 80,
            looks: 85,
            intelligence: 60,
            isAlive: true,
            petSpecies: 'cat_persian'
          });
          log({ de: 'Du hast eine liebevolle Katze adoptiert! Sie schnurrt glücklich auf deinem Schoß.', en: 'You adopted a loving cat! She purrs happily on your lap.' }, 'good');
        }
      },
      {
        text: { de: 'Ihr etwas Futter geben, aber draußen lassen.', en: 'Give her some food, but leave her outside.' },
        effect: (c, log) => {
          c.attributes.karma = Math.min(100, c.attributes.karma + 5);
          log({ de: 'Die Katze hat das Futter verschlungen und ist in die Nacht weitergezogen.', en: 'The cat devoured the food and wandered off into the night.' }, 'info');
        }
      }
    ]
  }
];

// Procedural Event Generator to guarantee 300+ diverse events with dynamic consequences!
export const getYearlyRandomEvent = (char: Character): GameEvent => {
  // Filter static events applicable to current age
  const validStatic = STATIC_EVENTS.filter(e => char.age >= e.minAge && char.age <= e.maxAge && (!e.condition || e.condition(char)));
  
  // 50% chance to pick a hand-crafted event if available
  if (validStatic.length > 0 && Math.random() < 0.5) {
    const pick = validStatic[Math.floor(Math.random() * validStatic.length)];
    return pick;
  }

  // Generate dynamic contextual event based on category and stats
  const categories: GameEvent['category'][] = ['school', 'family', 'love', 'health', 'career', 'finance', 'leisure', 'luck', 'misfortune', 'crime', 'pets'];
  let pool = categories;
  if (char.age < 6) pool = ['family', 'health', 'luck', 'pets'];
  else if (char.age < 18) pool = ['school', 'family', 'love', 'health', 'leisure', 'luck', 'pets'];
  else if (char.age > 65) pool = ['family', 'health', 'finance', 'leisure', 'luck', 'misfortune', 'pets'];

  const chosenCat = pool[Math.floor(Math.random() * pool.length)];
  const eventId = `proc_${chosenCat}_${char.age}_${Math.floor(Math.random() * 1000)}`;

  switch (chosenCat) {
    case 'school':
      return {
        id: eventId,
        title: { de: 'Schulprojekt & Prüfung', en: 'School Project & Exam' },
        description: { de: 'Eine wichtige Klassenarbeit oder ein Gruppenprojekt steht diese Woche an. Wie bereitest du dich vor?', en: 'An important exam or group project is coming up this week. How do you prepare?' },
        category: 'school',
        minAge: 6,
        maxAge: 25,
        choices: [
          {
            text: { de: 'Intensiv lernen und Bestnote anstreben!', en: 'Study hard and aim for top grade!' },
            effect: (c, log) => {
              c.education.grade = Math.min(100, c.education.grade + 8);
              c.attributes.intelligence = Math.min(100, c.attributes.intelligence + 4);
              c.attributes.stress = Math.min(100, c.attributes.stress + 5);
              log({ de: 'Dein Fleiß hat sich ausgezahlt: Du hast eine Eins geschrieben!', en: 'Your hard work paid off: You got an A!' }, 'good');
            }
          },
          {
            text: { de: 'Ein wenig spicken und auf Glück hoffen.', en: 'Cheat a little and hope for luck.' },
            effect: (c, log) => {
              if (Math.random() > 0.4) {
                c.education.grade = Math.min(100, c.education.grade + 5);
                log({ de: 'Der Spicker hat funktioniert! Eine solide Note ohne Aufwand.', en: 'The cheat sheet worked! A solid grade with no effort.' }, 'good');
              } else {
                c.education.grade = Math.max(0, c.education.grade - 15);
                c.attributes.discipline = Math.max(0, c.attributes.discipline - 10);
                log({ de: 'Erwischt! Der Lehrer hat dir eine Sechs gegeben und deine Eltern informiert.', en: 'Busted! The teacher gave you an F and informed your parents.' }, 'bad');
              }
            }
          }
        ]
      };

    case 'family':
      return {
        id: eventId,
        title: { de: 'Familientreffen am Sonntag', en: 'Sunday Family Gathering' },
        description: { de: 'Deine Verwandten laden zum großen Sonntagsbraten oder Kuchenessen ein. Es wird viel geredet und diskutiert.', en: 'Your relatives invite you for a big Sunday roast and cake. There is much talk and debate.' },
        category: 'family',
        minAge: 0,
        maxAge: 100,
        choices: [
          {
            text: { de: 'Fröhlich mitfeiern und Komplimente verteilen.', en: 'Celebrate happily and give compliments.' },
            effect: (c, log) => {
              c.attributes.happiness = Math.min(100, c.attributes.happiness + 8);
              c.relationships.forEach(r => {
                if (r.type === 'mother' || r.type === 'father' || r.type === 'sibling') {
                  r.relationship = Math.min(100, r.relationship + 8);
                }
              });
              log({ de: 'Ein harmonischer Familiennachmittag! Der Zusammenhalt wächst.', en: 'A harmonious afternoon! Family bonds grow stronger.' }, 'good');
            }
          },
          {
            text: { de: 'In eine hitzige Debatte über Politik geraten.', en: 'Get into a heated political debate.' },
            effect: (c, log) => {
              c.attributes.stress = Math.min(100, c.attributes.stress + 10);
              log({ de: 'Es gab laute Worte am Esstisch. Die Stimmung war danach etwas im Keller.', en: 'There were loud words at the dinner table. The mood dropped afterwards.' }, 'info');
            }
          }
        ]
      };

    case 'career':
      return {
        id: eventId,
        title: { de: 'Herausforderung im Job', en: 'Workplace Challenge' },
        description: { de: 'Ein wichtiges Projekt gerät in Verzug. Dein Vorgesetzter fragt, wer die Verantwortung für die Rettung übernimmt.', en: 'An important project is falling behind. Your manager asks who will take responsibility to save it.' },
        category: 'career',
        minAge: 18,
        maxAge: 65,
        choices: [
          {
            text: { de: 'Freiwillig melden und Überstunden machen!', en: 'Volunteer and work overtime!' },
            effect: (c, log) => {
              c.career.performance = Math.min(100, c.career.performance + 15);
              c.attributes.stress = Math.min(100, c.attributes.stress + 12);
              log({ de: 'Du hast das Projekt gerettet! Deine Beförderungschancen steigen dramatisch.', en: 'You saved the project! Your promotion chances rise dramatically.' }, 'good');
            }
          },
          {
            text: { de: 'Dich unauffällig verhalten und pünktlich gehen.', en: 'Keep a low profile and leave on time.' },
            effect: (c, log) => {
              c.attributes.happiness = Math.min(100, c.attributes.happiness + 5);
              log({ de: 'Du hattest einen entspannten Feierabend, während andere im Büro schwitzten.', en: 'You had a relaxing evening while others sweated in the office.' }, 'info');
            }
          }
        ]
      };

    case 'finance':
      return {
        id: eventId,
        title: { de: 'Unerwartete Rechnung', en: 'Unexpected Bill' },
        description: { de: 'Die Jahresabrechnung für Strom, Heizung und Versicherung flattert ins Haus. Eine Nachzahlung wird fällig.', en: 'The annual utility and insurance settlement arrives. A supplementary payment is due.' },
        category: 'finance',
        minAge: 18,
        maxAge: 90,
        choices: [
          {
            text: { de: 'Zähneknirschend bezahlen (-450 €).', en: 'Gritted teeth and pay (-450 €).' },
            effect: (c, log) => {
              c.finances.bankBalance -= 450;
              c.attributes.stress = Math.min(100, c.attributes.stress + 5);
              log({ de: 'Die Rechnung ist bezahlt. Deine Finanzen sind wieder im Lot.', en: 'The bill is paid. Your finances are balanced again.' }, 'info');
            }
          },
          {
            text: { de: 'Versuchen, den Betrag zu reklamieren und zu verhandeln.', en: 'Try to dispute and negotiate the amount.' },
            effect: (c, log) => {
              if (c.attributes.intelligence >= 65) {
                log({ de: 'Du hast einen Rechenfehler im Bescheid gefunden! Du musst nichts nachzahlen!', en: 'You found a calculation error in the statement! You pay nothing!' }, 'good');
              } else {
                c.finances.bankBalance -= 500; // inkl. Mahngebühr
                log({ de: 'Der Einspruch wurde abgelehnt und Mahngebühren kamen hinzu (-500 €).', en: 'The appeal was rejected and late fees were added (-500 €).' }, 'bad');
              }
            }
          }
        ]
      };

    case 'health':
      return {
        id: eventId,
        title: { de: 'Wetterwechsel & Erkältungswelle', en: 'Weather Change & Cold Wave' },
        description: { de: 'Eine heftige Erkältungswelle geht um. Du spürst ein leichtes Kratzen im Hals.', en: 'A heavy cold wave is going around. You feel a slight tickle in your throat.' },
        category: 'health',
        minAge: 0,
        maxAge: 100,
        choices: [
          {
            text: { de: 'Viel heißer Tee, Vitamine und früh schlafen.', en: 'Lots of hot tea, vitamins and sleep early.' },
            effect: (c, log) => {
              c.attributes.health = Math.min(100, c.attributes.health + 5);
              log({ de: 'Dein Immunsystem hat die Erkältung erfolgreich abgewehrt!', en: 'Your immune system successfully fought off the cold!' }, 'good');
            }
          },
          {
            text: { de: 'Ignorieren und feiern gehen!', en: 'Ignore it and go partying!' },
            effect: (c, log) => {
              c.attributes.health = Math.max(0, c.attributes.health - 15);
              c.attributes.energy = Math.max(0, c.attributes.energy - 15);
              log({ de: 'Das war zu viel: Du lagst 3 Tage mit Fieber im Bett.', en: 'That was too much: You spent 3 days in bed with a fever.' }, 'bad');
            }
          }
        ]
      };

    case 'leisure':
      return {
        id: eventId,
        title: { de: 'Spontaner Wochenend-Trip', en: 'Spontaneous Weekend Trip' },
        description: { de: 'Deine Freunde schlagen vor, spontan ein langes Wochenende in einer aufregenden europäischen Metropole zu verbringen.', en: 'Your friends suggest spending a spontaneous long weekend in an exciting European metropolis.' },
        category: 'leisure',
        minAge: 16,
        maxAge: 70,
        choices: [
          {
            text: { de: 'Koffer packen und mitreisen! (-350 €)', en: 'Pack bags and join them! (-350 €)' },
            effect: (c, log) => {
              if (c.finances.bankBalance >= 350) c.finances.bankBalance -= 350;
              c.attributes.happiness = Math.min(100, c.attributes.happiness + 20);
              c.attributes.stress = Math.max(0, c.attributes.stress - 20);
              log({ de: 'Eine unvergessliche Reise voller Spaß, gutes Essen und tolle Erinnerungen!', en: 'An unforgettable trip full of fun, great food and memories!' }, 'good');
            }
          },
          {
            text: { de: 'Zuhause bleiben und entspannen.', en: 'Stay home and relax.' },
            effect: (c, log) => {
              c.attributes.energy = Math.min(100, c.attributes.energy + 10);
              log({ de: 'Du hast ein ruhiges Wochenende auf der Couch verbracht und Geld gespart.', en: 'You spent a quiet weekend on the couch and saved money.' }, 'info');
            }
          }
        ]
      };

    case 'love':
      return {
        id: eventId,
        title: { de: 'Romantische Begegnung im Alltag', en: 'Romantic Everyday Encounter' },
        description: { de: 'Im Café stößt du versehentlich mit jemandem zusammen. Eure Blicke treffen sich und die Person lächelt charmant.', en: 'At a café you accidentally bump into someone. Your eyes meet and the person smiles charmingly.' },
        category: 'love',
        minAge: 18,
        maxAge: 65,
        choices: [
          {
            text: { de: 'Auf einen Kaffee einladen und nach der Nummer fragen!', en: 'Invite for a coffee and ask for the number!' },
            effect: (c, log) => {
              if (c.attributes.looks >= 45 || Math.random() > 0.4) {
                c.attributes.happiness = Math.min(100, c.attributes.happiness + 15);
                log({ de: 'Ihr hattet ein wundervolles Gespräch und trefft euch nächste Woche wieder!', en: 'You had a wonderful conversation and are meeting again next week!' }, 'good');
              } else {
                log({ de: 'Die Person bedankte sich höflich, war aber in Eile und musste weiter.', en: 'The person thanked you politely, but was in a rush and had to leave.' }, 'info');
              }
            }
          },
          {
            text: { de: 'Entschuldigen und weitergehen.', en: 'Apologize and walk on.' },
            effect: (_c, log) => {
              log({ de: 'Eine kurze, freundliche Begegnung im Alltag.', en: 'A brief, friendly encounter in daily life.' }, 'info');
            }
          }
        ]
      };

    case 'luck':
      return {
        id: eventId,
        title: { de: 'Glücklicher Zufall', en: 'Lucky Coincidence' },
        description: { de: 'Heute scheint einfach dein Glückstag zu sein. Alles gelingt dir mühelos und du findest eine 50-Euro-Note auf der Straße.', en: 'Today just seems to be your lucky day. Everything works out effortlessly and you find a 50 Euro note on the street.' },
        category: 'luck',
        minAge: 5,
        maxAge: 95,
        choices: [
          {
            text: { de: 'Das Glück genießen!', en: 'Enjoy the luck!' },
            effect: (c, log) => {
              c.finances.bankBalance += 50;
              c.attributes.happiness = Math.min(100, c.attributes.happiness + 15);
              c.attributes.stress = Math.max(0, c.attributes.stress - 15);
              log({ de: 'Ein perfekter Tag, der dir neuen Schwung und 50 € schenkt!', en: 'A perfect day that gives you renewed momentum and 50 €!' }, 'good');
            }
          }
        ]
      };

    default:
      return {
        id: eventId,
        title: { de: 'Alltags-Ereignis', en: 'Daily Occurrence' },
        description: { de: 'Ein ganz normaler Tag neigt sich dem Ende zu. Was machst du am Abend?', en: 'A completely normal day comes to an end. What do you do in the evening?' },
        category: 'leisure',
        minAge: 10,
        maxAge: 90,
        choices: [
          {
            text: { de: 'Ein gutes Buch lesen und früh schlafen.', en: 'Read a good book and sleep early.' },
            effect: (c, log) => {
              c.attributes.intelligence = Math.min(100, c.attributes.intelligence + 2);
              c.attributes.energy = Math.min(100, c.attributes.energy + 10);
              log({ de: 'Ein entspannender Abend.', en: 'A relaxing evening.' }, 'info');
            }
          },
          {
            text: { de: 'Lieblingsserie streamen und snacken.', en: 'Stream favorite show and snack.' },
            effect: (c, log) => {
              c.attributes.happiness = Math.min(100, c.attributes.happiness + 5);
              log({ de: 'Gute Unterhaltung auf der Couch.', en: 'Great entertainment on the couch.' }, 'info');
            }
          }
        ]
      };
  }
};
