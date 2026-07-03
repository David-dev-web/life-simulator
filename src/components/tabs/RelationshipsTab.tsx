import React, { useState } from 'react';
import type { Character, Person } from '../../types/game';
import { PET_SPECIES } from '../../data/pets';
import { Heart, Gift, MessageCircle, DollarSign, UserPlus, Trash2, PawPrint, HeartHandshake, Baby, Skull } from 'lucide-react';
import { sound } from '../../utils/sound';
import { addLogEntry } from '../../utils/engine';

interface RelationshipsTabProps {
  char: Character;
  onUpdateCharacter: (char: Character) => void;
  language: 'de' | 'en';
}

export const RelationshipsTab: React.FC<RelationshipsTabProps> = ({ char, onUpdateCharacter, language }) => {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showPetAdoption, setShowPetAdoption] = useState<boolean>(false);

  const selectedPerson = char.relationships.find(r => r.id === selectedPersonId);

  const handleInteraction = (type: 'chat' | 'gift' | 'argue' | 'money' | 'marry' | 'baby' | 'breakup') => {
    if (!selectedPerson) return;
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const target = c.relationships.find(r => r.id === selectedPersonId);
    if (!target) return;

    switch (type) {
      case 'chat': {
        const bonus = Math.floor(Math.random() * 8) + 4;
        target.relationship = Math.min(100, target.relationship + bonus);
        c.attributes.happiness = Math.min(100, c.attributes.happiness + 4);
        addLogEntry(c, {
          de: `💬 Du hast dich angenehm mit ${target.name} unterhalten (+${bonus}% Beziehung).`,
          en: `💬 You had a pleasant conversation with ${target.name} (+${bonus}% relationship).`
        }, 'good', language);
        break;
      }
      case 'gift': {
        const cost = 150 * c.country.salaryMultiplier;
        if (c.finances.bankBalance < cost) {
          alert(language === 'de' ? 'Nicht genug Geld auf dem Konto!' : 'Not enough money in your account!');
          return;
        }
        c.finances.bankBalance -= cost;
        const bonus = 18;
        target.relationship = Math.min(100, target.relationship + bonus);
        c.attributes.happiness = Math.min(100, c.attributes.happiness + 6);
        addLogEntry(c, {
          de: `🎁 Du hast ${target.name} ein Geschenk für ${cost.toLocaleString()} € gemacht! (+${bonus}% Beziehung).`,
          en: `🎁 You gave ${target.name} a gift worth ${cost.toLocaleString()} €! (+${bonus}% relationship).`
        }, 'good', language);
        break;
      }
      case 'argue': {
        const drop = Math.floor(Math.random() * 20) + 10;
        target.relationship = Math.max(0, target.relationship - drop);
        c.attributes.stress = Math.min(100, c.attributes.stress + 10);
        addLogEntry(c, {
          de: `⚡ Du hattest einen heftigen Streit mit ${target.name} (-${drop}% Beziehung).`,
          en: `⚡ You had a heated argument with ${target.name} (-${drop}% relationship).`
        }, 'bad', language);
        break;
      }
      case 'money': {
        if (target.relationship < 50) {
          addLogEntry(c, {
            de: `💸 Du hast ${target.name} um Geld gebeten, aber wurdest empört abgewiesen!`,
            en: `💸 You asked ${target.name} for money, but were rejected indignantly!`
          }, 'bad', language);
          target.relationship = Math.max(0, target.relationship - 10);
        } else {
          const amount = Math.round((Math.random() * 300 + 100) * c.country.salaryMultiplier);
          c.finances.bankBalance += amount;
          target.relationship = Math.max(0, target.relationship - 5);
          addLogEntry(c, {
            de: `💵 ${target.name} war großzügig und hat dir ${amount.toLocaleString()} € geliehen!`,
            en: `💵 ${target.name} was generous and lent you ${amount.toLocaleString()} €!`
          }, 'good', language);
        }
        break;
      }
      case 'marry': {
        if (target.type !== 'partner') return;
        const weddingCost = Math.round(5000 * c.country.salaryMultiplier);
        if (c.finances.bankBalance < weddingCost) {
          if (!confirm(language === 'de' ? `Eine Traumhochzeit kostet ca. ${weddingCost.toLocaleString()} €. Dein Konto wird ins Minus geraten. Trotzdem heiraten?` : `A dream wedding costs ca. ${weddingCost.toLocaleString()} €. Your account will go negative. Marry anyway?`)) {
            return;
          }
        }
        c.finances.bankBalance -= weddingCost;
        target.type = 'spouse';
        target.relationship = 100;
        c.attributes.happiness = Math.min(100, c.attributes.happiness + 30);
        addLogEntry(c, {
          de: `💍 TRAUMHOCHZEIT! Du hast deine große Liebe ${target.name} geheiratet! (-${weddingCost.toLocaleString()} € für die Feier).`,
          en: `💍 DREAM WEDDING! You married your great love ${target.name}! (-${weddingCost.toLocaleString()} € for the celebration).`
        }, 'major', language);
        break;
      }
      case 'baby': {
        if (c.age < 18) {
          alert(language === 'de' ? 'Du musst mindestens 18 Jahre alt sein!' : 'You must be at least 18 years old!');
          return;
        }
        const childName = prompt(language === 'de' ? 'Wie soll euer neues Kind heißen?' : 'What should your new baby be named?', language === 'de' ? 'Leo' : 'Leo');
        if (!childName) return;

        const newBaby: Person = {
          id: 'child_' + Date.now(),
          name: childName.trim() + ' ' + c.lastName,
          type: 'child',
          gender: Math.random() > 0.5 ? 'male' : 'female',
          age: 0,
          relationship: 95,
          health: 90,
          looks: Math.round((c.attributes.looks + target.looks) / 2),
          intelligence: Math.round((c.attributes.intelligence + target.intelligence) / 2),
          isAlive: true
        };
        c.relationships.push(newBaby);
        c.attributes.happiness = Math.min(100, c.attributes.happiness + 35);
        addLogEntry(c, {
          de: `🍼 NACHWUCHS! Ihr habt ein wundervolles Baby namens ${newBaby.name} bekommen!`,
          en: `🍼 NEW BABY! You had a wonderful baby named ${newBaby.name}!`
        }, 'major', language);
        break;
      }
      case 'breakup': {
        if (!confirm(language === 'de' ? `Willst du dich wirklich von ${target.name} trennen / scheiden lassen?` : `Do you really want to break up / divorce ${target.name}?`)) return;
        if (target.type === 'spouse') {
          // Scheidungskosten
          const divorceCost = Math.round(Math.max(1000, c.finances.netWorth * 0.2));
          c.finances.bankBalance -= divorceCost;
          addLogEntry(c, {
            de: `💔 TEURE SCHEIDUNG! Die Trennung von ${target.name} hat dich ${divorceCost.toLocaleString()} € an Anwalts- und Unterhaltskosten gekostet.`,
            en: `💔 EXPENSIVE DIVORCE! The divorce from ${target.name} cost you ${divorceCost.toLocaleString()} € in legal and alimony costs.`
          }, 'bad', language);
        } else {
          addLogEntry(c, {
            de: `💔 Du hast dich von ${target.name} getrennt.`,
            en: `💔 You broke up with ${target.name}.`
          }, 'info', language);
        }
        target.type = 'ex';
        target.relationship = 10;
        c.attributes.happiness = Math.max(0, c.attributes.happiness - 25);
        setSelectedPersonId(null);
        break;
      }
    }

    onUpdateCharacter(c);
  };

  const handleAdoptPet = (speciesId: string) => {
    sound.playClick();
    const species = PET_SPECIES.find(s => s.id === speciesId);
    if (!species) return;

    const c = JSON.parse(JSON.stringify(char)) as Character;
    if (c.finances.bankBalance < species.price) {
      alert(language === 'de' ? 'Nicht genug Geld auf dem Konto für dieses Tier!' : 'Not enough money in your account for this pet!');
      return;
    }

    const petName = prompt(language === 'de' ? `Wie soll dein ${species.name.de} heißen?` : `What should your ${species.name.en} be named?`, 'Bari');
    if (!petName) return;

    c.finances.bankBalance -= species.price;
    const newPet: Person = {
      id: 'pet_' + Date.now(),
      name: petName.trim(),
      type: 'pet',
      gender: 'diverse',
      age: 0,
      relationship: 95,
      health: 90,
      looks: 80,
      intelligence: 60,
      isAlive: true,
      petSpecies: species.id
    };

    c.relationships.push(newPet);
    c.attributes.happiness = Math.min(100, c.attributes.happiness + species.happinessBonus);
    addLogEntry(c, {
      de: `🐾 Du hast ein wundervolles Haustier (${species.name.de}) namens ${petName} für ${species.price.toLocaleString()} € adoptiert!`,
      en: `🐾 You adopted a wonderful pet (${species.name.en}) named ${petName} for ${species.price.toLocaleString()} €!`
    }, 'good', language);

    setShowPetAdoption(false);
    onUpdateCharacter(c);
  };

  const handleFindPartner = () => {
    if (char.age < 16) {
      alert(language === 'de' ? 'Du bist noch zu jung zum Daten! Warte bis du 16 bist.' : 'You are too young to date! Wait until age 16.');
      return;
    }
    if (char.relationships.some(r => r.type === 'partner' || r.type === 'spouse')) {
      alert(language === 'de' ? 'Du hast bereits eine Beziehung!' : 'You already have a relationship!');
      return;
    }
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const datingNames = ['Sam', 'Robin', 'Alex', 'Jordan', 'Quinn', 'Kim', 'Luca', 'Taylor', 'Lou', 'Dominique'];
    const pickName = datingNames[Math.floor(Math.random() * datingNames.length)];
    const newPartner: Person = {
      id: 'partner_' + Date.now(),
      name: pickName + ' ' + (['Meyer', 'Smith', 'Keller', 'Garcia', 'Miller'][Math.floor(Math.random() * 5)]),
      type: 'partner',
      gender: c.gender === 'male' ? 'female' : 'male',
      age: Math.max(16, c.age + (Math.floor(Math.random() * 7) - 3)),
      relationship: 75,
      health: 85,
      looks: Math.floor(Math.random() * 50) + 40,
      intelligence: Math.floor(Math.random() * 50) + 40,
      isAlive: true,
      jobTitle: language === 'de' ? 'Angestellte(r)' : 'Employee'
    };

    c.relationships.push(newPartner);
    c.attributes.happiness = Math.min(100, c.attributes.happiness + 20);
    addLogEntry(c, {
      de: `💖 Du hast über eine Dating-App ${newPartner.name} (${newPartner.age} Jahre alt) kennengelernt! Ihr seid jetzt ein Paar.`,
      en: `💖 You met ${newPartner.name} (${newPartner.age} yrs old) on a dating app! You are now a couple.`
    }, 'good', language);

    onUpdateCharacter(c);
  };

  const activePeople = char.relationships.filter(r => r.isAlive && r.type !== 'ex');
  const deceasedPeople = char.relationships.filter(r => !r.isAlive);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header bar with actions */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{language === 'de' ? 'Familie & Beziehungen' : 'Family & Relationships'}</h2>
            <p className="text-xs text-slate-400">
              {language === 'de' ? 'Pflege Kontakte, heirate deine Liebe, gründe eine Familie oder adoptiere Haustiere.' : 'Maintain bonds, marry your love, start a family or adopt pets.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {!char.relationships.some(r => (r.type === 'partner' || r.type === 'spouse') && r.isAlive) && (
            <button
              onClick={handleFindPartner}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'de' ? 'Dating-App / Partnersuche' : 'Find Dating Partner'}</span>
            </button>
          )}

          <button
            onClick={() => { sound.playClick(); setShowPetAdoption(true); }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
          >
            <PawPrint className="w-4 h-4 text-amber-400" />
            <span>{language === 'de' ? '+ Haustier adoptieren' : '+ Adopt Pet'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Relationships */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: People List */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 px-1">{language === 'de' ? 'Aktive Beziehungen' : 'Active Relationships'} ({activePeople.length})</h3>
          {activePeople.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-slate-500 text-sm border border-slate-800">
              {language === 'de' ? 'Keine aktiven Beziehungen vorhanden.' : 'No active relationships.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activePeople.map(person => {
                const isSelected = selectedPersonId === person.id;
                const badgeColor =
                  person.type === 'spouse' || person.type === 'partner' ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' :
                  person.type === 'child' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                  person.type === 'pet' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                  'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';

                return (
                  <div
                    key={person.id}
                    onClick={() => { sound.playClick(); setSelectedPersonId(isSelected ? null : person.id); }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer glass-panel ${
                      isSelected
                        ? 'border-pink-500 bg-slate-900 shadow-lg shadow-pink-500/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} inline-block mb-1 uppercase tracking-wider`}>
                          {person.type === 'mother' ? (language === 'de' ? 'Mutter' : 'Mother') :
                           person.type === 'father' ? (language === 'de' ? 'Vater' : 'Father') :
                           person.type === 'sibling' ? (language === 'de' ? 'Geschwister' : 'Sibling') :
                           person.type === 'partner' ? (language === 'de' ? 'Partner/in' : 'Partner') :
                           person.type === 'spouse' ? (language === 'de' ? 'Ehepartner/in' : 'Spouse') :
                           person.type === 'child' ? (language === 'de' ? 'Kind' : 'Child') :
                           (language === 'de' ? 'Haustier' : 'Pet')}
                        </span>
                        <h4 className="font-bold text-slate-100 text-sm truncate">{person.name}</h4>
                        <p className="text-xs text-slate-400">
                          {person.age} {language === 'de' ? 'Jahre' : 'years'} • {person.jobTitle || (person.petSpecies ? (language === 'de' ? 'Tier' : 'Animal') : '')}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-pink-400 flex items-center justify-end space-x-1">
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          <span>{person.relationship}%</span>
                        </span>
                      </div>
                    </div>

                    {/* Mini progress bar */}
                    <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3 overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-300"
                        style={{ width: `${person.relationship}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Deceased Section */}
          {deceasedPeople.length > 0 && (
            <div className="pt-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 flex items-center space-x-1">
                <Skull className="w-3.5 h-3.5" />
                <span>{language === 'de' ? 'Verstorbene Verwandte & Tiere' : 'Deceased Relatives & Pets'} ({deceasedPeople.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {deceasedPeople.map(p => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-900 text-slate-500 text-xs flex items-center justify-between">
                    <span className="truncate">{p.name} ({p.type})</span>
                    <span className="font-mono text-[10px]">† {p.age} J.</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Interaction Panel */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl sticky top-20">
            {!selectedPerson ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <MessageCircle className="w-10 h-10 mx-auto stroke-1 opacity-50" />
                <p className="text-sm font-semibold">{language === 'de' ? 'Wähle eine Person oder ein Haustier links aus, um zu interagieren.' : 'Select a person or pet on the left to interact.'}</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white">{selectedPerson.name}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedPerson.age} {language === 'de' ? 'Jahre' : 'years'} • {language === 'de' ? 'Beziehung' : 'Relationship'}: <span className="text-pink-400 font-bold">{selectedPerson.relationship}%</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleInteraction('chat')}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors flex items-center space-x-2 text-xs font-bold"
                  >
                    <MessageCircle className="w-4 h-4 text-cyan-400" />
                    <span>{language === 'de' ? 'Unterhalten / Zeit verbringen' : 'Chat / Spend Time'}</span>
                  </button>

                  <button
                    onClick={() => handleInteraction('gift')}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors flex items-center justify-between text-xs font-bold"
                  >
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-pink-400" />
                      <span>{language === 'de' ? 'Geschenk machen' : 'Give Gift'}</span>
                    </div>
                    <span className="text-slate-400 font-mono">-150 €</span>
                  </button>

                  <button
                    onClick={() => handleInteraction('argue')}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700/80 hover:border-rose-800/80 transition-colors flex items-center space-x-2 text-xs font-bold"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span>{language === 'de' ? 'Streiten / Konfrontieren' : 'Argue / Confront'}</span>
                  </button>

                  {selectedPerson.type !== 'pet' && selectedPerson.type !== 'child' && (
                    <button
                      onClick={() => handleInteraction('money')}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors flex items-center space-x-2 text-xs font-bold"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'de' ? 'Um Geld bitten' : 'Ask for Money'}</span>
                    </button>
                  )}

                  {selectedPerson.type === 'partner' && (
                    <button
                      onClick={() => handleInteraction('marry')}
                      className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs shadow-md shadow-pink-600/30 transition-all flex items-center space-x-2"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>{language === 'de' ? '💍 Heiratsantrag machen!' : '💍 Propose Marriage!'}</span>
                    </button>
                  )}

                  {(selectedPerson.type === 'partner' || selectedPerson.type === 'spouse') && (
                    <>
                      <button
                        onClick={() => handleInteraction('baby')}
                        className="w-full py-2.5 px-3 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/50 transition-colors flex items-center space-x-2 text-xs font-bold"
                      >
                        <Baby className="w-4 h-4 text-purple-400" />
                        <span>{language === 'de' ? '👶 Kind bekommen / zeugen' : '👶 Have a Baby'}</span>
                      </button>

                      <button
                        onClick={() => handleInteraction('breakup')}
                        className="w-full py-2 px-3 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 transition-colors flex items-center space-x-2 text-xs font-semibold mt-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{selectedPerson.type === 'spouse' ? (language === 'de' ? 'Scheidung einreichen' : 'File for Divorce') : (language === 'de' ? 'Beziehung beenden' : 'Break up')}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pet Adoption Modal Panel */}
      {showPetAdoption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <PawPrint className="w-5 h-5 text-amber-400" />
                <span>{language === 'de' ? 'Tierheim - Haustier adoptieren' : 'Animal Shelter - Adopt a Pet'}</span>
              </h3>
              <button
                onClick={() => setShowPetAdoption(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {PET_SPECIES.map(pet => (
                <div
                  key={pet.id}
                  onClick={() => handleAdoptPet(pet.id)}
                  className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{pet.icon}</span>
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-amber-300">{pet.name[language] || pet.name.de}</h4>
                      <p className="text-[11px] text-slate-400">
                        {language === 'de' ? 'Lebenserwartung' : 'Lifespan'}: ~{pet.maxLifespan} J. • +{pet.happinessBonus}% {language === 'de' ? 'Glück' : 'Happiness'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/50">
                      {pet.price === 0 ? (language === 'de' ? 'Kostenlos' : 'Free') : `${pet.price.toLocaleString()} €`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPetAdoption(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              {language === 'de' ? 'Schließen' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
