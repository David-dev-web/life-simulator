import React, { useState, useEffect } from 'react';
import type { Character, Gender, StartCondition, Attributes } from '../../types/game';
import { COUNTRIES } from '../../data/countries';
import { getRandomName } from '../../data/names';
import { Dices, Sparkles, User, Globe, Award, Heart, Brain, Zap, Smile, Shield } from 'lucide-react';
import { sound } from '../../utils/sound';

interface CharacterCreationProps {
  onCreateCharacter: (char: Character) => void;
  language: 'de' | 'en';
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCreateCharacter, language }) => {
  const [countryId, setCountryId] = useState<string>('de');
  const [gender, setGender] = useState<Gender>('male');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [startCondition, setStartCondition] = useState<StartCondition>('normal');
  const [attributes, setAttributes] = useState<Attributes>({
    health: 80,
    happiness: 80,
    intelligence: 50,
    looks: 50,
    discipline: 50,
    stress: 10,
    energy: 90,
    karma: 50
  });

  const generateRandomStats = (cond: StartCondition) => {
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const base: Attributes = {
      health: rand(60, 95),
      happiness: rand(65, 95),
      intelligence: rand(30, 80),
      looks: rand(30, 85),
      discipline: rand(40, 80),
      stress: rand(5, 25),
      energy: rand(75, 100),
      karma: rand(45, 75)
    };

    if (cond === 'wealthy') {
      base.happiness = Math.min(100, base.happiness + 15);
      base.looks = Math.min(100, base.looks + 10);
    } else if (cond === 'orphan') {
      base.happiness = Math.max(20, base.happiness - 25);
      base.discipline = Math.min(100, base.discipline + 15);
      base.stress = Math.min(100, base.stress + 20);
    } else if (cond === 'genius') {
      base.intelligence = rand(88, 100);
      base.looks = rand(25, 70);
    } else if (cond === 'athletic') {
      base.health = rand(90, 100);
      base.energy = rand(92, 100);
      base.looks = Math.min(100, base.looks + 15);
    } else if (cond === 'sickly') {
      base.health = rand(25, 50);
      base.energy = rand(30, 60);
      base.stress = Math.min(100, base.stress + 15);
    } else if (cond === 'royalty') {
      base.happiness = rand(85, 100);
      base.looks = rand(70, 98);
      base.karma = rand(50, 90);
    }

    setAttributes(base);
  };

  const handleRandomizeName = () => {
    sound.playClick();
    const { firstName: fn, lastName: ln } = getRandomName(countryId, gender);
    setFirstName(fn);
    setLastName(ln);
  };

  const handleRerollStats = () => {
    sound.playClick();
    generateRandomStats(startCondition);
  };

  useEffect(() => {
    const { firstName: fn, lastName: ln } = getRandomName(countryId, gender);
    setFirstName(fn);
    setLastName(ln);
  }, [countryId, gender]);

  useEffect(() => {
    generateRandomStats(startCondition);
  }, [startCondition]);

  const handleStartLife = () => {
    if (!firstName || !lastName) return;
    sound.playClick();

    const selectedCountry = COUNTRIES.find(c => c.id === countryId) || COUNTRIES[0];
    let startMoney = 0;
    if (startCondition === 'wealthy') startMoney = 50000;
    if (startCondition === 'royalty') startMoney = 500000;
    if (startCondition === 'orphan') startMoney = 0;

    const newChar: Character = {
      id: 'char_' + Date.now(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      country: selectedCountry,
      startCondition,
      age: 0,
      isAlive: true,
      attributes,
      education: {
        currentLevel: 'none',
        completedLevels: ['none'],
        grade: 80,
        yearsInCurrentLevel: 0,
        isStudying: false
      },
      career: {
        yearsInJob: 0,
        salary: 0,
        performance: 75,
        isUnemployed: true,
        hasRetired: false,
        pension: 0,
        jobHistory: []
      },
      relationships: [
        {
          id: 'mother_' + Date.now(),
          name: 'Elena ' + lastName.trim(),
          type: 'mother',
          gender: 'female',
          age: 28,
          relationship: startCondition === 'orphan' ? 0 : 90,
          health: 85,
          looks: 70,
          intelligence: 65,
          isAlive: startCondition !== 'orphan',
          jobTitle: language === 'de' ? 'Angestellte' : 'Employee'
        },
        {
          id: 'father_' + Date.now(),
          name: 'Marcus ' + lastName.trim(),
          type: 'father',
          gender: 'male',
          age: 31,
          relationship: startCondition === 'orphan' ? 0 : 85,
          health: 88,
          looks: 65,
          intelligence: 70,
          isAlive: startCondition !== 'orphan',
          jobTitle: language === 'de' ? 'Kaufmann' : 'Merchant'
        }
      ],
      properties: [],
      vehicles: [],
      finances: {
        bankBalance: startMoney,
        netWorth: startMoney,
        loans: [],
        investments: {},
        yearlyIncome: 0,
        yearlyExpenses: 0,
        yearlyTaxes: 0
      },
      crime: {
        inPrison: false,
        prisonYearsRemaining: 0,
        crimesCommitted: 0,
        timesArrested: 0,
        wantedLevel: 0
      },
      log: [
        {
          id: 'log_birth',
          age: 0,
          text: language === 'de'
            ? `🍼 Du wurdest in ${selectedCountry.name.de} als ${gender === 'male' ? 'Junge' : gender === 'female' ? 'Mädchen' : 'Kind'} geboren!`
            : `🍼 You were born in ${selectedCountry.name.en} as a ${gender}!`,
          type: 'major',
          year: new Date().getFullYear()
        }
      ],
      unlockedAchievements: [],
      generation: 1,
      illnesses: startCondition === 'sickly' ? ['Chronisches Asthma'] : []
    };

    onCreateCharacter(newChar);
  };

  const conditions: { id: StartCondition; label: { de: string; en: string }; desc: { de: string; en: string }; icon: string }[] = [
    { id: 'normal', label: { de: 'Mittelschicht', en: 'Middle Class' }, desc: { de: 'Ausgeglichener Start in einer liebevollen Familie.', en: 'Balanced start in a loving family.' }, icon: '🏡' },
    { id: 'wealthy', label: { de: 'Reiche Eltern', en: 'Wealthy Parents' }, desc: { de: 'Startguthaben von 50.000 € & hoher Wohlstand.', en: 'Starting balance of €50,000 & high prosperity.' }, icon: '💎' },
    { id: 'orphan', label: { de: 'Waisenhaus', en: 'Orphanage' }, desc: { de: 'Keine Eltern, aber eiserne Disziplin und Ehrgeiz.', en: 'No parents, but iron discipline and ambition.' }, icon: '🏚️' },
    { id: 'genius', label: { de: 'Begabt / Genie', en: 'Child Prodigy' }, desc: { de: 'Überdurchschnittlich hoher Intelligenzquotient.', en: 'Exceptionally high intelligence quotient.' }, icon: '🧠' },
    { id: 'athletic', label: { de: 'Athletik-Genetiker', en: 'Athletic Prodigy' }, desc: { de: 'Perfekte Gesundheit und grenzenlose Energie.', en: 'Perfect health and boundless energy.' }, icon: '⚡' },
    { id: 'sickly', label: { de: 'Chronisch krank', en: 'Chronically Sick' }, desc: { de: 'Schwieriger Start mit gesundheitlichen Hürden.', en: 'Challenging start with health obstacles.' }, icon: '🤒' },
    { id: 'royalty', label: { de: 'Adelsgeschlecht', en: 'Royal Lineage' }, desc: { de: 'Geboren als Königs-Erbe mit 500.000 € Startgeld!', en: 'Born as royal heir with €500,000 starting cash!' }, icon: '👑' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 animate-fadeIn">
      {/* Title section */}
      <div className="text-center space-y-2 py-4">
        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {language === 'de' ? 'Dein neues Leben beginnt' : 'Your New Life Begins'}
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          {language === 'de'
            ? 'Passe Namen, Herkunft und Startbedingungen an. Begleite deinen Charakter von der Wiege bis zur Rente!'
            : 'Customize your name, origin, and start conditions. Guide your character from cradle to retirement!'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Identity & Country */}
        <div className="glass-panel rounded-2xl p-6 space-y-5 border border-slate-800 shadow-xl">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold border-b border-slate-800 pb-3">
            <User className="w-5 h-5" />
            <span>{language === 'de' ? '1. Identität & Herkunft' : '1. Identity & Origin'}</span>
          </div>

          {/* Gender selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 block">{language === 'de' ? 'Geschlecht' : 'Gender'}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'diverse'] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => { sound.playClick(); setGender(g); }}
                  className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all ${
                    gender === g
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {g === 'male' ? (language === 'de' ? '👨 Männlich' : '👨 Male') : g === 'female' ? (language === 'de' ? '👩 Weiblich' : '👩 Female') : (language === 'de' ? '🧑 Divers' : '🧑 Diverse')}
                </button>
              ))}
            </div>
          </div>

          {/* Name input with randomize button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400">{language === 'de' ? 'Name des Charakters' : 'Character Name'}</label>
              <button
                type="button"
                onClick={handleRandomizeName}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-medium transition-colors"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>{language === 'de' ? 'Zufall' : 'Randomize'}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={language === 'de' ? 'Vorname' : 'First Name'}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={language === 'de' ? 'Nachname' : 'Last Name'}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Country selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>{language === 'de' ? 'Geburtsland' : 'Birth Country'}</span>
              <Globe className="w-3.5 h-3.5 text-slate-500" />
            </label>
            <select
              value={countryId}
              onChange={(e) => { sound.playClick(); setCountryId(e.target.value); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            >
              {COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name[language] || c.name.de} ({c.currencySymbol} • {language === 'de' ? 'Steuern' : 'Tax'}: {Math.round(c.taxRate * 100)}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column: Start Conditions & Stats Preview */}
        <div className="glass-panel rounded-2xl p-6 space-y-5 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-purple-400 font-bold">
                <Award className="w-5 h-5" />
                <span>{language === 'de' ? '2. Startbedingungen & DNA' : '2. Start Conditions & DNA'}</span>
              </div>
              <button
                type="button"
                onClick={handleRerollStats}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center space-x-1 text-xs"
                title="Reroll DNA stats"
              >
                <Dices className="w-4 h-4 text-pink-400" />
                <span>{language === 'de' ? 'DNA neu würfeln' : 'Reroll DNA'}</span>
              </button>
            </div>

            {/* Condition selector grid */}
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {conditions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { sound.playClick(); setStartCondition(c.id); }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    startCondition === c.id
                      ? 'bg-purple-900/40 border-purple-500/80 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-xs">
                    <span className="text-base">{c.icon}</span>
                    <span className="truncate">{c.label[language] || c.label.de}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                    {c.desc[language] || c.desc.de}
                  </p>
                </button>
              ))}
            </div>

            {/* Stat Preview */}
            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80 space-y-2">
              <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>{language === 'de' ? 'Generierte DNA-Werte:' : 'Generated DNA Stats:'}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {startCondition === 'royalty' ? '+500k €' : startCondition === 'wealthy' ? '+50k €' : '+0 €'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg">
                  <span className="text-rose-400 flex items-center space-x-1"><Heart className="w-3.5 h-3.5"/><span>{language === 'de' ? 'Gesundheit' : 'Health'}:</span></span>
                  <span className="font-mono font-bold text-slate-200">{attributes.health}%</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg">
                  <span className="text-amber-300 flex items-center space-x-1"><Smile className="w-3.5 h-3.5"/><span>{language === 'de' ? 'Glück' : 'Happiness'}:</span></span>
                  <span className="font-mono font-bold text-slate-200">{attributes.happiness}%</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg">
                  <span className="text-cyan-300 flex items-center space-x-1"><Brain className="w-3.5 h-3.5"/><span>{language === 'de' ? 'Intelligenz' : 'Intelligence'}:</span></span>
                  <span className="font-mono font-bold text-slate-200">{attributes.intelligence}%</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg">
                  <span className="text-purple-300 flex items-center space-x-1"><Sparkles className="w-3.5 h-3.5"/><span>{language === 'de' ? 'Aussehen' : 'Looks'}:</span></span>
                  <span className="font-mono font-bold text-slate-200">{attributes.looks}%</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg">
                  <span className="text-emerald-300 flex items-center space-x-1"><Shield className="w-3.5 h-3.5"/><span>{language === 'de' ? 'Disziplin' : 'Discipline'}:</span></span>
                  <span className="font-mono font-bold text-slate-200">{attributes.discipline}%</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg">
                  <span className="text-blue-300 flex items-center space-x-1"><Zap className="w-3.5 h-3.5"/><span>{language === 'de' ? 'Energie' : 'Energy'}:</span></span>
                  <span className="font-mono font-bold text-slate-200">{attributes.energy}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Start button */}
          <button
            type="button"
            onClick={handleStartLife}
            disabled={!firstName || !lastName}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-extrabold text-lg shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4"
          >
            <Sparkles className="w-5 h-5 animate-spin-slow" />
            <span>{language === 'de' ? 'Dieses Leben beginnen!' : 'Start This Life!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
