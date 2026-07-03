import React from 'react';
import type { Character, GameSettings } from '../../types/game';
import { Volume2, VolumeX, Settings, RefreshCw } from 'lucide-react';
import { sound } from '../../utils/sound';

interface HeaderProps {
  char: Character | null;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onOpenSettings: () => void;
  onNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  char,
  settings,
  onUpdateSettings,
  onOpenSettings,
  onNewGame
}) => {
  const toggleSound = () => {
    const next = !settings.soundEnabled;
    onUpdateSettings({ ...settings, soundEnabled: next });
    sound.setEnabled(next);
    if (next) sound.playClick();
  };

  const toggleLang = () => {
    sound.playClick();
    onUpdateSettings({ ...settings, language: settings.language === 'de' ? 'en' : 'de' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand & Character identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/20">
            V
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                VitaLog
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {settings.language === 'de' ? 'Lebenssim' : 'LifeSim'}
              </span>
            </div>
            {char && (
              <p className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                <span>{char.country.flag}</span>
                <span>{char.firstName} {char.lastName}</span>
                <span className="text-slate-600">•</span>
                <span>{char.age} {settings.language === 'de' ? 'Jahre' : 'years'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-mono font-semibold">
                  {char.country.currencySymbol}{char.finances.bankBalance.toLocaleString()}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions & Settings */}
        <div className="flex items-center space-x-2">
          {char && (
            <button
              onClick={() => {
                sound.playClick();
                if (confirm(settings.language === 'de' ? 'Wirklich ein neues Leben beginnen? Dein aktueller Fortschritt wird beendet!' : 'Really start a new life? Your current progress will end!')) {
                  onNewGame();
                }
              }}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800 flex items-center space-x-1 text-xs"
              title={settings.language === 'de' ? 'Neues Leben starten' : 'Start New Life'}
            >
              <RefreshCw className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">{settings.language === 'de' ? 'Neustart' : 'Restart'}</span>
            </button>
          )}

          <button
            onClick={toggleLang}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs font-bold transition-colors border border-slate-800"
            title="Switch Language (Deutsch / English)"
          >
            {settings.language.toUpperCase()}
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
            title={settings.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-400" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
            title={settings.language === 'de' ? 'Einstellungen & Spielstand' : 'Settings & Save'}
          >
            <Settings className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
