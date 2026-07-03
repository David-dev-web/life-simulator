import React, { useState } from 'react';
import type { Character, MultiLifeStats, GameSettings } from '../../types/game';
import { exportGameToJSON, importGameFromJSONString } from '../../utils/storage';
import { sound } from '../../utils/sound';
import { Settings, Volume2, VolumeX, Globe, Save, Download, Upload, RefreshCw, Trash2, Award, TreeDeciduous, Sparkles } from 'lucide-react';

interface SettingsTabProps {
  char: Character | null;
  stats: MultiLifeStats;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onUpdateCharacter: (char: Character | null) => void;
  onUpdateStats: (stats: MultiLifeStats) => void;
  onNewGame: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  char,
  stats,
  settings,
  onUpdateSettings,
  onUpdateCharacter,
  onUpdateStats,
  onNewGame
}) => {
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const res = importGameFromJSONString(content);
        onUpdateSettings(res.settings);
        onUpdateStats(res.stats);
        onUpdateCharacter(res.char);
        sound.playAchievement();
        alert(settings.language === 'de' ? 'Spielstand erfolgreich importiert!' : 'Save game successfully imported!');
      } catch (err) {
        setImportError(settings.language === 'de' ? 'Fehler beim Lesen der JSON-Datei. Ungültiges Format!' : 'Error reading JSON file. Invalid format!');
      }
    };
    reader.readAsText(file);
  };

  const handlePlayAsHeir = (childName: string) => {
    if (!char) return;
    sound.playClick();
    const child = char.relationships.find(r => r.name === childName && r.type === 'child');
    if (!child) return;

    const inheritance = Math.round(Math.max(0, char.finances.netWorth * 0.75)); // 25% Erbschaftssteuer
    const newChar: Character = {
      ...char,
      id: 'char_' + Date.now(),
      firstName: child.name.split(' ')[0],
      lastName: char.lastName,
      gender: child.gender,
      age: Math.max(18, child.age),
      isAlive: true,
      causeOfDeath: undefined,
      attributes: {
        health: child.health || 85,
        happiness: 80,
        intelligence: child.intelligence || 70,
        looks: child.looks || 70,
        discipline: 65,
        stress: 15,
        energy: 90,
        karma: 60
      },
      education: {
        currentLevel: 'high_school',
        completedLevels: ['none', 'kindergarten', 'elementary', 'high_school'],
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
          id: 'parent_' + Date.now(),
          name: `${char.firstName} ${char.lastName}`,
          type: 'mother',
          gender: char.gender,
          age: char.age,
          relationship: 100,
          health: 0,
          looks: 50,
          intelligence: char.attributes.intelligence,
          isAlive: false
        }
      ],
      properties: [],
      vehicles: [],
      finances: {
        bankBalance: inheritance,
        netWorth: inheritance,
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
          id: 'log_heir',
          age: Math.max(18, child.age),
          text: settings.language === 'de'
            ? `👑 Du triffst als Erbe von ${char.firstName} ${char.lastName} dein Schicksal an! Erbschaft: ${inheritance.toLocaleString()} €.`
            : `👑 You take control as the heir of ${char.firstName} ${char.lastName}! Inheritance: ${inheritance.toLocaleString()} €.`,
          type: 'major',
          year: new Date().getFullYear()
        }
      ],
      generation: (char.generation || 1) + 1,
      parentName: `${char.firstName} ${char.lastName}`,
      illnesses: []
    };

    onUpdateCharacter(newChar);
    sound.playCoins();
  };

  const childrenList = char ? char.relationships.filter(r => r.type === 'child') : [];

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">{settings.language === 'de' ? 'Einstellungen & Spielstand' : 'Settings & Save Game'}</h2>
          <p className="text-xs text-slate-400">
            {settings.language === 'de' ? 'Sprache, Sound, JSON-Speicherstände, Dynastie-Stammbaum und Multi-Leben Statistiken.' : 'Language, sound, JSON saves, Dynasty tree, and multi-life statistics.'}
          </p>
        </div>
      </div>

      {/* Heir Continuation (if character is dead and has children) */}
      {char && !char.isAlive && childrenList.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/80 via-indigo-950/60 to-slate-900 border-2 border-purple-500 shadow-2xl space-y-4">
          <div className="flex items-center space-x-3 text-purple-300">
            <Sparkles className="w-8 h-8 shrink-0 text-pink-400 animate-spin-slow" />
            <div>
              <h3 className="text-xl font-black text-white">{settings.language === 'de' ? '👑 Dynastie-Erbe antreten!' : '👑 Play as Family Heir!'}</h3>
              <p className="text-xs text-purple-200">
                {settings.language === 'de' ? 'Wähle eines deiner Kinder aus, um als nächste Generation (Generation ' + ((char.generation || 1) + 1) + ') weiterzuspielen und das Vermögen zu erben!' : 'Select one of your children to play as the next generation and inherit the wealth!'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {childrenList.map(child => (
              <button
                key={child.id}
                onClick={() => handlePlayAsHeir(child.name)}
                className="p-4 rounded-2xl bg-slate-900/90 hover:bg-purple-900/60 border border-slate-800 hover:border-purple-500 text-left transition-all flex items-center justify-between group shadow-md"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {settings.language === 'de' ? 'Erbe / Kind' : 'Heir / Child'}
                  </span>
                  <h4 className="font-bold text-slate-100 text-sm mt-1 group-hover:text-white">{child.name}</h4>
                  <p className="text-xs text-slate-400">Alter: {child.age} J. • Int: {child.intelligence}%</p>
                </div>
                <span className="text-xs font-bold text-pink-400 bg-pink-950/40 px-3 py-1.5 rounded-xl border border-pink-800/50 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  {settings.language === 'de' ? 'Spielen ➔' : 'Play ➔'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Settings & Save Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3">
            {settings.language === 'de' ? 'Spiel-Optionen' : 'Game Options'}
          </h3>

          <div className="space-y-4">
            {/* Language Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{settings.language === 'de' ? 'Sprache / Language' : 'Language'}</h4>
                  <p className="text-xs text-slate-400">{settings.language === 'de' ? 'Deutsch (Default)' : 'English'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onUpdateSettings({ ...settings, language: settings.language === 'de' ? 'en' : 'de' });
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
              >
                {settings.language === 'de' ? '🇩🇪 DE ➔ 🇬🇧 EN' : '🇬🇧 EN ➔ 🇩🇪 DE'}
              </button>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-3">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-rose-400" />}
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{settings.language === 'de' ? 'Soundeffekte' : 'Sound Effects'}</h4>
                  <p className="text-xs text-slate-400">{settings.language === 'de' ? 'Web Audio API Synth' : 'Web Audio API Synth'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !settings.soundEnabled;
                  onUpdateSettings({ ...settings, soundEnabled: next });
                  sound.setEnabled(next);
                  if (next) sound.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  settings.soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {settings.soundEnabled ? (settings.language === 'de' ? 'An ✅' : 'On ✅') : (settings.language === 'de' ? 'Aus 🔇' : 'Off 🔇')}
              </button>
            </div>

            {/* Auto Save Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-3">
                <Save className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{settings.language === 'de' ? 'Automatisches Speichern' : 'Auto-Save'}</h4>
                  <p className="text-xs text-slate-400">{settings.language === 'de' ? 'Speichert bei jedem Lebensjahr' : 'Saves every year aged'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onUpdateSettings({ ...settings, autoSave: !settings.autoSave });
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  settings.autoSave ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {settings.autoSave ? (settings.language === 'de' ? 'An ✅' : 'On ✅') : (settings.language === 'de' ? 'Aus' : 'Off')}
              </button>
            </div>
          </div>
        </div>

        {/* Save & Export Management */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3">
            {settings.language === 'de' ? 'Speicherstand Verwaltung' : 'Save Management'}
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => {
                sound.playClick();
                exportGameToJSON(char, stats, settings);
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{settings.language === 'de' ? 'Spielstand als JSON exportieren (Download)' : 'Export Save as JSON (Download)'}</span>
            </button>

            <label className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>{settings.language === 'de' ? 'JSON-Spielstand importieren (Upload)' : 'Import Save from JSON (Upload)'}</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
            {importError && <p className="text-xs text-rose-400 font-bold text-center">{importError}</p>}

            <button
              onClick={() => {
                sound.playClick();
                if (confirm(settings.language === 'de' ? 'Wirklich ein komplett neues Leben starten?' : 'Really start a new life?')) {
                  onNewGame();
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs transition-all flex items-center justify-center space-x-2 shadow-md mt-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{settings.language === 'de' ? 'Neues Leben erstellen (Charaktererstellung)' : 'Start New Life (Creation screen)'}</span>
            </button>

            <button
              onClick={() => {
                if (confirm(settings.language === 'de' ? 'ALLE Speicherstände und Statistiken löschen?' : 'Delete ALL saves and statistics?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full py-2 px-4 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 font-semibold text-xs transition-all flex items-center justify-center space-x-1 mt-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{settings.language === 'de' ? 'Alle Speicherstände & Statistiken zurücksetzen' : 'Reset All Saves & Stats'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Life Statistics & Dynasty Tree */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center space-x-2 text-amber-400 font-bold border-b border-slate-800 pb-3">
          <Award className="w-5 h-5" />
          <span>{settings.language === 'de' ? 'Statistiken über mehrere Leben' : 'Multi-Life Statistics'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
            <p className="text-xs text-slate-400">{settings.language === 'de' ? 'Gespielte Leben' : 'Lives Played'}</p>
            <p className="text-xl font-mono font-black text-white">{stats.totalLivesPlayed}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
            <p className="text-xs text-slate-400">{settings.language === 'de' ? 'Jahre gelebt (Total)' : 'Total Years Lived'}</p>
            <p className="text-xl font-mono font-black text-indigo-400">{stats.totalYearsLived}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
            <p className="text-xs text-slate-400">{settings.language === 'de' ? 'Höchtes Vermögen' : 'Highest Net Worth'}</p>
            <p className="text-xl font-mono font-black text-emerald-400">€{stats.highestNetWorth.toLocaleString()}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
            <p className="text-xs text-slate-400">{settings.language === 'de' ? 'Ältestes erreichtes Alter' : 'Oldest Age Reached'}</p>
            <p className="text-xl font-mono font-black text-amber-400">{stats.oldestAgeReached} J.</p>
          </div>
        </div>

        {/* Dynasty Tree Section */}
        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
            <TreeDeciduous className="w-4 h-4" />
            <span>{settings.language === 'de' ? 'Dynastie-Stammbaum (Vergangene Generationen)' : 'Dynasty Family Tree (Past Generations)'}</span>
          </div>

          {stats.dynastyTree.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-900 text-center text-slate-500 text-xs">
              {settings.language === 'de' ? 'Noch keine Generation verstorben. Schließe ein Leben ab, um es hier im Stammbaum zu verewigen!' : 'No generations completed yet. Finish a life to memorialize it in the family tree!'}
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {stats.dynastyTree.map((node, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-purple-400 mr-2">Gen {node.generation}:</span>
                    <span className="font-bold text-slate-100">{node.name}</span>
                    <span className="text-slate-400 ml-2">({node.jobTitle})</span>
                  </div>
                  <div className="font-mono text-slate-300">
                    † {node.yearsLived} J. • <span className="text-emerald-400">€{node.netWorth.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
