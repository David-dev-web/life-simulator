import { useState, useEffect } from 'react';
import type { Character, GameSettings, MultiLifeStats, GameEvent } from './types/game';
import { loadCharacter, saveCharacter, loadStats, saveStats, loadSettings, saveSettings } from './utils/storage';
import { processYearlyAgeUp, addLogEntry } from './utils/engine';
import { sound } from './utils/sound';

import { Header } from './components/common/Header';
import { StatBar } from './components/common/StatBar';
import { Modal } from './components/common/Modal';
import { ConfettiEffect } from './components/common/Confetti';

import { CharacterCreation } from './components/creation/CharacterCreation';

import { LifeTab } from './components/tabs/LifeTab';
import { RelationshipsTab } from './components/tabs/RelationshipsTab';
import { CareerTab } from './components/tabs/CareerTab';
import { FinanceTab } from './components/tabs/FinanceTab';
import { RealEstateTab } from './components/tabs/RealEstateTab';
import { VehiclesTab } from './components/tabs/VehiclesTab';
import { CrimeTab } from './components/tabs/CrimeTab';
import { HealthTab } from './components/tabs/HealthTab';
import { AchievementsTab } from './components/tabs/AchievementsTab';
import { SettingsTab } from './components/tabs/SettingsTab';

import { Users, Briefcase, DollarSign, Home, Car, ShieldAlert, Trophy, Settings, Calendar, HeartPulse } from 'lucide-react';

export function App() {
  const [character, setCharacter] = useState<Character | null>(() => loadCharacter());
  const [stats, setStats] = useState<MultiLifeStats>(() => loadStats());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [activeTab, setActiveTab] = useState<string>('life');
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  useEffect(() => {
    if (settings.autoSave) {
      saveCharacter(character);
    }
  }, [character, settings.autoSave]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleUpdateCharacter = (newChar: Character | null) => {
    setCharacter(newChar);
    if (newChar) {
      const currentStats = loadStats();
      setStats(currentStats);
    }
  };

  const handleAgeUp = () => {
    if (!character || !character.isAlive) return;

    let triggeredEvent: GameEvent | null = null;
    const nextChar = processYearlyAgeUp(
      character,
      stats,
      settings.language,
      (ev) => {
        triggeredEvent = ev;
      }
    );

    setCharacter(nextChar);
    const updatedStats = loadStats();
    setStats(updatedStats);

    // Check if new achievements were unlocked
    if (nextChar.unlockedAchievements.length > character.unlockedAchievements.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }

    if (triggeredEvent && nextChar.isAlive) {
      setActiveEvent(triggeredEvent);
    }
  };

  const handleEventChoice = (choiceIndex: number) => {
    if (!activeEvent || !character) return;
    sound.playClick();

    const c = JSON.parse(JSON.stringify(character)) as Character;
    const choice = activeEvent.choices[choiceIndex];
    if (choice) {
      choice.effect(c, (msg, type) => {
        addLogEntry(c, msg, type || 'info', settings.language);
      });
    }

    setActiveEvent(null);
    setCharacter(c);
  };

  const navItems = [
    { id: 'life', label: settings.language === 'de' ? 'Leben' : 'Life', icon: Calendar },
    { id: 'relationships', label: settings.language === 'de' ? 'Beziehungen' : 'Relations', icon: Users },
    { id: 'career', label: settings.language === 'de' ? 'Karriere' : 'Career', icon: Briefcase },
    { id: 'finances', label: settings.language === 'de' ? 'Finanzen' : 'Finances', icon: DollarSign },
    { id: 'real_estate', label: settings.language === 'de' ? 'Immobilien' : 'Properties', icon: Home },
    { id: 'vehicles', label: settings.language === 'de' ? 'Fahrzeuge' : 'Vehicles', icon: Car },
    { id: 'crime', label: settings.language === 'de' ? 'Kriminalität' : 'Crime', icon: ShieldAlert },
    { id: 'health', label: settings.language === 'de' ? 'Gesundheit' : 'Health', icon: HeartPulse },
    { id: 'achievements', label: settings.language === 'de' ? 'Erfolge' : 'Trophies', icon: Trophy },
    { id: 'settings', label: settings.language === 'de' ? 'Optionen' : 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <ConfettiEffect trigger={showConfetti} />

      <Header
        char={character}
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenSettings={() => setActiveTab('settings')}
        onNewGame={() => {
          saveCharacter(null);
          setCharacter(null);
          setActiveTab('life');
        }}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {!character ? (
          <CharacterCreation
            onCreateCharacter={(newChar) => {
              setCharacter(newChar);
              saveCharacter(newChar);
              setActiveTab('life');
              sound.playCoins();
            }}
            language={settings.language}
          />
        ) : (
          <div className="space-y-6">
            {/* Stat Bar */}
            <StatBar attributes={character.attributes} language={settings.language} />

            {/* Main Navigation Tabs */}
            <nav className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { sound.playClick(); setActiveTab(item.id); }}
                    className={`px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.id === 'achievements' && (
                      <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded-full text-amber-300 border border-slate-800 font-mono">
                        {character.unlockedAchievements.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Active Tab View */}
            <div className="mt-4">
              {activeTab === 'life' && (
                <LifeTab char={character} onAgeUp={handleAgeUp} onOpenTab={setActiveTab} language={settings.language} />
              )}
              {activeTab === 'relationships' && (
                <RelationshipsTab char={character} onUpdateCharacter={handleUpdateCharacter} language={settings.language} />
              )}
              {activeTab === 'career' && (
                <CareerTab char={character} onUpdateCharacter={handleUpdateCharacter} language={settings.language} />
              )}
              {activeTab === 'finances' && (
                <FinanceTab char={character} onUpdateCharacter={handleUpdateCharacter} language={settings.language} />
              )}
              {activeTab === 'real_estate' && (
                <RealEstateTab char={character} onUpdateCharacter={handleUpdateCharacter} language={settings.language} />
              )}
              {activeTab === 'vehicles' && (
                <VehiclesTab char={character} onUpdateCharacter={handleUpdateCharacter} language={settings.language} />
              )}
              {activeTab === 'crime' && (
                <CrimeTab char={character} onUpdateCharacter={handleUpdateCharacter} language={settings.language} />
              )}
              {activeTab === 'health' && (
                <HealthTab char={character} onUpdateCharacter={handleUpdateCharacter} language={settings.language} />
              )}
              {activeTab === 'achievements' && (
                <AchievementsTab char={character} stats={stats} language={settings.language} />
              )}
              {activeTab === 'settings' && (
                <SettingsTab
                  char={character}
                  stats={stats}
                  settings={settings}
                  onUpdateSettings={setSettings}
                  onUpdateCharacter={handleUpdateCharacter}
                  onUpdateStats={setStats}
                  onNewGame={() => {
                    saveCharacter(null);
                    setCharacter(null);
                    setActiveTab('life');
                  }}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Random Event Modal */}
      {activeEvent && character && (
        <Modal
          isOpen={!!activeEvent}
          title={activeEvent.title[settings.language] || activeEvent.title.de}
          preventOutsideClick={true}
          maxWidth="lg"
        >
          <div className="space-y-6 py-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-base leading-relaxed">
              {activeEvent.description[settings.language] || activeEvent.description.de}
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
                {settings.language === 'de' ? 'Wie entscheidest du dich?' : 'How do you choose?'}
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {activeEvent.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEventChoice(idx)}
                    className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500 text-left text-sm font-bold text-slate-100 hover:text-white transition-all shadow-md group flex items-center justify-between"
                  >
                    <span>{choice.text[settings.language] || choice.text.de}</span>
                    <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs">➔</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 mt-12 text-center text-xs text-slate-500 bg-slate-950/50">
        <p>
          VitaLog LifeSim • {settings.language === 'de' ? 'Inspiriert von BitLife & Entwickelt mit React + TS + Tailwind' : 'Inspired by BitLife & Built with React + TS + Tailwind'} • Keine Server-Abhängigkeiten
        </p>
      </footer>
    </div>
  );
}

export default App;
