import React, { useState } from 'react';
import type { Character } from '../../types/game';
import type { BurglaryTarget } from '../../data/minigames';
import { BURGLARY_TARGETS } from '../../data/minigames';
import { ShieldAlert, Lock, Skull, KeyRound} from 'lucide-react';
import { sound } from '../../utils/sound';
import { addLogEntry } from '../../utils/engine';

interface CrimeTabProps {
  char: Character;
  onUpdateCharacter: (char: Character) => void;
  language: 'de' | 'en';
}

export const CrimeTab: React.FC<CrimeTabProps> = ({ char, onUpdateCharacter, language }) => {
  const [activeBurglary, setActiveBurglary] = useState<BurglaryTarget | null>(null);
  const [burglaryProgress, setBurglaryProgress] = useState<number>(0);

  const handlePettyCrime = (type: 'shoplift' | 'pickpocket' | 'tax_fraud' | 'hack') => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;

    if (c.crime.inPrison) {
      alert(language === 'de' ? 'Du sitzt bereits im Gefängnis!' : 'You are already in prison!');
      return;
    }

    let successChance = 0.7;
    let loot = 0;
    let jailYears = 1;
    let name = '';

    if (type === 'shoplift') {
      name = language === 'de' ? 'Ladendiebstahl' : 'Shoplifting';
      successChance = 0.78 + (c.attributes.discipline * 0.002);
      loot = Math.round(Math.random() * 180 + 40);
      jailYears = 1;
    } else if (type === 'pickpocket') {
      name = language === 'de' ? 'Taschendiebstahl' : 'Pickpocketing';
      successChance = 0.68;
      loot = Math.round(Math.random() * 450 + 100);
      jailYears = 1;
    } else if (type === 'tax_fraud') {
      name = language === 'de' ? 'Steuerhinterziehung' : 'Tax Fraud';
      successChance = 0.55 + (c.attributes.intelligence * 0.003);
      loot = Math.round(Math.max(5000, c.finances.yearlyIncome * 0.35));
      jailYears = 3;
    } else if (type === 'hack') {
      name = language === 'de' ? 'Cybercrime / Banken-Hacking' : 'Cybercrime / Bank Hacking';
      successChance = 0.40 + (c.attributes.intelligence * 0.005);
      loot = Math.round(Math.random() * 45000 + 15000);
      jailYears = 5;
    }

    if (Math.random() < successChance) {
      c.finances.bankBalance += loot;
      c.crime.crimesCommitted += 1;
      c.attributes.karma = Math.max(0, c.attributes.karma - 15);
      sound.playCoins();
      addLogEntry(c, {
        de: `🦹 ERFOLG! Du hast beim "${name}" unentdeckt ${loot.toLocaleString()} € erbeutet!`,
        en: `🦹 SUCCESS! You looted ${loot.toLocaleString()} € undetected in "${name}"!`
      }, 'good', language);
    } else {
      c.crime.inPrison = true;
      c.crime.prisonYearsRemaining += jailYears;
      c.crime.timesArrested += 1;
      c.attributes.happiness = Math.max(0, c.attributes.happiness - 35);
      if (c.career.currentJob) {
        c.career.jobHistory.push(c.career.currentJob.title[language] || c.career.currentJob.title.de);
        c.career.currentJob = undefined;
      }
      c.career.isUnemployed = true;
      sound.playBad();
      addLogEntry(c, {
        de: `🚨 ERWISCHT! Die Polizei hat dich beim "${name}" verhaftet! Du wurdest zu ${jailYears} Jahren Gefängnis verurteilt und hast deinen Job verloren.`,
        en: `🚨 BUSTED! The police arrested you for "${name}"! You were sentenced to ${jailYears} years in prison and lost your job.`
      }, 'bad', language);
    }

    onUpdateCharacter(c);
  };

  const startBurglary = (target: BurglaryTarget) => {
    sound.playClick();
    if (char.crime.inPrison) return;
    setActiveBurglary(target);
    setBurglaryProgress(0);
  };

  const handleCrackSafeStep = () => {
    if (!activeBurglary) return;
    sound.playClick();
    const next = burglaryProgress + 25;
    if (next >= 100) {
      // Finished safe breaking! Check risk
      const c = JSON.parse(JSON.stringify(char)) as Character;
      if (Math.random() * 100 < activeBurglary.riskOfArrest) {
        // Arrested!
        c.crime.inPrison = true;
        c.crime.prisonYearsRemaining += Math.round(activeBurglary.difficulty / 15) + 2;
        c.crime.timesArrested += 1;
        c.attributes.happiness = Math.max(0, c.attributes.happiness - 40);
        sound.playBad();
        addLogEntry(c, {
          de: `🚨 ALARM! Der Sicherheitsdienst hat dich im "${activeBurglary.name.de}" überrascht! Du steckst für ${c.crime.prisonYearsRemaining} Jahre hinter Gittern.`,
          en: `🚨 ALARM! Security caught you inside "${activeBurglary.name.en}"! You are behind bars for ${c.crime.prisonYearsRemaining} years.`
        }, 'bad', language);
      } else {
        // Successful heist!
        c.finances.bankBalance += activeBurglary.potentialLoot;
        c.crime.crimesCommitted += 1;
        c.attributes.karma = Math.max(0, c.attributes.karma - 25);
        if (activeBurglary.id === 'bank_vault') {
          c.unlockedAchievements.push('crime_bank_rob');
        }
        sound.playCoins();
        addLogEntry(c, {
          de: `💰 MEISTER-EINBRUCH! Du hast den Tresor von "${activeBurglary.name.de}" geknackt und ${activeBurglary.potentialLoot.toLocaleString()} € erbeutet!`,
          en: `💰 MASTER HEIST! You cracked the safe of "${activeBurglary.name.en}" and looted ${activeBurglary.potentialLoot.toLocaleString()} €!`
        }, 'major', language);
      }
      setActiveBurglary(null);
      onUpdateCharacter(c);
    } else {
      setBurglaryProgress(next);
    }
  };

  const handleJailbreak = () => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    if (!confirm(language === 'de' ? 'Ein Ausbruchsversuch ist extrem gefährlich! Wenn du scheiterst, verdoppelt sich deine Strafe. Trotzdem versuchen?' : 'A jailbreak attempt is extremely risky! If you fail, your sentence doubles. Try anyway?')) return;

    if (Math.random() > 0.70) {
      c.crime.inPrison = false;
      c.crime.prisonYearsRemaining = 0;
      c.attributes.happiness = Math.min(100, c.attributes.happiness + 35);
      sound.playCoins();
      addLogEntry(c, {
        de: `🏃 SPEKTAKULÄRER AUSBRUCH! Du hast die Wärter getäuscht und bist erfolgreich aus dem Gefängnis getürmt!`,
        en: `🏃 SPECTACULAR JAILBREAK! You fooled the guards and escaped prison successfully!`
      }, 'major', language);
    } else {
      c.crime.prisonYearsRemaining = Math.max(2, c.crime.prisonYearsRemaining * 2);
      c.attributes.health = Math.max(10, c.attributes.health - 20);
      sound.playBad();
      addLogEntry(c, {
        de: `🚨 AUSBRUCH GESCHEITERT! Die Wärter haben dich im Lichtkegel gefasst! Deine Strafe wurde auf ${c.crime.prisonYearsRemaining} Jahre verdoppelt.`,
        en: `🚨 JAILBREAK FAILED! Guards caught you in the spotlight! Your sentence was doubled to ${c.crime.prisonYearsRemaining} years.`
      }, 'bad', language);
    }
    onUpdateCharacter(c);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{language === 'de' ? 'Kriminalitätssystem & Unterwelt' : 'Crime & Underworld System'}</h2>
            <p className="text-xs text-slate-400">
              {language === 'de' ? 'Schnelles Geld auf illegale Art. Aber Vorsicht vor Polizei, Gerichten und Gefängnis!' : 'Quick money through illegal means. Beware of police, courts, and prison!'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono font-bold">
          <span className="bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 text-rose-400">
            {char.crime.crimesCommitted} {language === 'de' ? 'Straftaten' : 'Crimes'}
          </span>
          <span className="bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 text-orange-400">
            {char.crime.timesArrested} {language === 'de' ? 'Verhaftungen' : 'Arrests'}
          </span>
        </div>
      </div>

      {/* Prison Banner if in prison */}
      {char.crime.inPrison && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/80 to-red-900/60 border-2 border-rose-600 shadow-2xl space-y-4 animate-pulse-subtle">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Lock className="w-10 h-10 text-rose-400 shrink-0" />
              <div>
                <h3 className="text-xl font-black text-white">{language === 'de' ? '🔒 DU SITZT IM GEFÄNGNIS!' : '🔒 YOU ARE IN PRISON!'}</h3>
                <p className="text-sm text-rose-200">
                  {language === 'de' ? `Verbleibende Haftzeit: ${char.crime.prisonYearsRemaining} Jahre. Du kannst altern oder ausbrechen.` : `Remaining sentence: ${char.crime.prisonYearsRemaining} years. You can age up or attempt a break out.`}
                </p>
              </div>
            </div>

            <button
              onClick={handleJailbreak}
              className="py-3 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-600/40 transition-all flex items-center space-x-2 shrink-0"
            >
              <Skull className="w-5 h-5" />
              <span>{language === 'de' ? 'Gefängnisausbruch wagen!' : 'Attempt Jailbreak!'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Petty Crimes Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 px-1">{language === 'de' ? 'Schnelle Gaunereien' : 'Petty Crimes'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'shoplift', title: language === 'de' ? '🛍️ Ladendiebstahl' : '🛍️ Shoplifting', desc: language === 'de' ? 'Geringes Risiko • Beute: ~150 €' : 'Low risk • Loot: ~150 €', risk: '~22% Risiko' },
            { id: 'pickpocket', title: language === 'de' ? '👛 Taschendiebstahl' : '👛 Pickpocketing', desc: language === 'de' ? 'Mittleres Risiko • Beute: ~350 €' : 'Medium risk • Loot: ~350 €', risk: '~32% Risiko' },
            { id: 'tax_fraud', title: language === 'de' ? '📑 Steuerhinterziehung' : '📑 Tax Fraud', desc: language === 'de' ? 'Hoher Gewinn durch manipulierte Bücher!' : 'High gains through manipulated books!', risk: '~45% Risiko' },
            { id: 'hack', title: language === 'de' ? '💻 Banken-Hacking' : '💻 Bank Hacking', desc: language === 'de' ? 'Extrem lukrativ (~30.000 €), aber FBI ermittelt!' : 'Extremely lucrative (~30,000 €), but FBI investigates!', risk: '~60% Risiko' }
          ].map(c => (
            <div key={c.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-lg flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-100 text-sm">{c.title}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-1">{c.desc}</p>
                <span className="inline-block text-[10px] font-mono font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded mt-2 border border-rose-900/60">
                  {c.risk}
                </span>
              </div>
              <button
                onClick={() => handlePettyCrime(c.id as any)}
                disabled={char.crime.inPrison}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 disabled:opacity-40 text-slate-200 hover:text-rose-200 font-bold text-xs transition-all border border-slate-700 hover:border-rose-700"
              >
                {language === 'de' ? 'Durchführen' : 'Execute'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Burglary Heist Minigame Section */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-rose-400 font-bold border-b border-slate-800 pb-3">
          <KeyRound className="w-5 h-5" />
          <span>{language === 'de' ? 'Einbruch-Minispiel: Tresor-Knacken' : 'Heist Minigame: Safe Cracking'}</span>
        </div>

        {!activeBurglary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BURGLARY_TARGETS.map(t => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-100 text-sm">{t.name[language] || t.name.de}</h4>
                  <p className="text-xs text-emerald-400 font-mono font-bold">
                    Loot: ~{t.potentialLoot.toLocaleString()} €
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono space-y-0.5 pt-1">
                    <p>Schwierigkeit: {t.difficulty}%</p>
                    <p className="text-rose-400">Verhaftungsrisiko: {t.riskOfArrest}%</p>
                  </div>
                </div>

                <button
                  onClick={() => startBurglary(t)}
                  disabled={char.crime.inPrison}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all"
                >
                  {language === 'de' ? 'Einbruch starten!' : 'Start Heist!'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-950 border-2 border-rose-500/80 space-y-5 text-center max-w-lg mx-auto animate-scaleUp">
            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">{language === 'de' ? 'AKTIVER EINBRUCH' : 'ACTIVE HEIST'}</span>
              <h3 className="text-xl font-black text-white">{activeBurglary.name[language] || activeBurglary.name.de}</h3>
              <p className="text-xs text-slate-400">
                {language === 'de' ? 'Klicke schnell auf den Button, um die Tresor-Kombination zu lösen!' : 'Click rapidly to solve the safe combination!'}
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
                <span>{language === 'de' ? 'Tresor-Fortschritt' : 'Safe Progress'}</span>
                <span>{burglaryProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-700 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 rounded-full transition-all duration-200"
                  style={{ width: `${burglaryProgress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={handleCrackSafeStep}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-base shadow-xl shadow-rose-600/30 transform active:scale-95 transition-all"
              >
                🔓 {language === 'de' ? 'KOMBINATION DREHEN! (+25%)' : 'TURN DIAL! (+25%)'}
              </button>
              <button
                onClick={() => setActiveBurglary(null)}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                {language === 'de' ? 'Abbrechen' : 'Abort'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
