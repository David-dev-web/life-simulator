import React, { useState } from 'react';
import type { Character, LogEntry } from '../../types/game';
import { Calendar, Play, HeartPulse, Sparkles, Filter, Skull, ChevronRight, ShieldAlert, BookOpen, Briefcase } from 'lucide-react';
import { sound } from '../../utils/sound';

interface LifeTabProps {
  char: Character;
  onAgeUp: () => void;
  onOpenTab: (tab: string) => void;
  language: 'de' | 'en';
}

export const LifeTab: React.FC<LifeTabProps> = ({ char, onAgeUp, onOpenTab, language }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredLogs = char.log.filter(l => {
    if (filter === 'all') return true;
    if (filter === 'major') return l.type === 'major' || l.type === 'achievement' || l.type === 'death';
    if (filter === 'good') return l.type === 'good';
    if (filter === 'bad') return l.type === 'bad' || l.type === 'death';
    return true;
  });

  const getLogBadge = (type: LogEntry['type']) => {
    switch (type) {
      case 'major': return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">{language === 'de' ? 'Meilenstein' : 'Major'}</span>;
      case 'good': return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">{language === 'de' ? 'Erfolg' : 'Good'}</span>;
      case 'bad': return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">{language === 'de' ? 'Rückschlag' : 'Bad'}</span>;
      case 'achievement': return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">🏆 {language === 'de' ? 'Trophäe' : 'Trophy'}</span>;
      case 'death': return <span className="bg-slate-700 text-slate-300 border border-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">💀 {language === 'de' ? 'Tod' : 'Death'}</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Huge Age Up Button */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Status summary */}
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20 font-black text-white shrink-0">
              {char.country.flag}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl md:text-2xl font-extrabold text-white">
                  {char.firstName} {char.lastName}
                </h2>
                {!char.isAlive && (
                  <span className="bg-rose-600 text-white font-bold text-xs px-2 py-0.5 rounded-md flex items-center space-x-1">
                    <Skull className="w-3.5 h-3.5" />
                    <span>{language === 'de' ? 'Verstorben' : 'Deceased'}</span>
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm text-slate-300 flex items-center space-x-2 flex-wrap">
                <span className="flex items-center space-x-1 text-indigo-300 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{char.age} {language === 'de' ? 'Jahre alt' : 'years old'}</span>
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {char.country.currencySymbol}{char.finances.netWorth.toLocaleString()} {language === 'de' ? 'Vermögen' : 'Net Worth'}
                </span>
                <span>•</span>
                <span className="text-slate-400">
                  {char.career.currentJob ? char.career.currentJob.title[language] || char.career.currentJob.title.de : char.education.isStudying ? (language === 'de' ? 'Schüler / Student' : 'Student') : (language === 'de' ? 'Arbeitslos' : 'Unemployed')}
                </span>
              </p>
            </div>
          </div>

          {/* Age Up Button */}
          <div className="w-full md:w-auto flex flex-col items-center sm:items-end space-y-2">
            {char.isAlive ? (
              <button
                onClick={() => {
                  sound.playClick();
                  onAgeUp();
                }}
                className="w-full md:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-slate-950 font-black text-lg md:text-xl shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-3 cursor-pointer border border-emerald-400/50"
              >
                <Play className="w-6 h-6 fill-current animate-pulse" />
                <span>{language === 'de' ? '+ Ein Jahr älter werden' : '+ Grow 1 Year Older'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenTab('settings');
                }}
                className="w-full md:w-auto py-4 px-8 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-lg shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>{language === 'de' ? 'Neues Leben starten / Erbe antreten' : 'Start New Life / Heir'}</span>
              </button>
            )}
            {char.crime.inPrison && (
              <span className="text-xs text-rose-400 font-bold flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{language === 'de' ? `Im Gefängnis (${char.crime.prisonYearsRemaining} J. übrig)` : `In Prison (${char.crime.prisonYearsRemaining} yrs left)`}</span>
              </span>
            )}
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 border-t border-slate-800/80 pt-5">
          <button
            onClick={() => { sound.playClick(); onOpenTab('relationships'); }}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 text-left transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'de' ? 'Beziehungen' : 'Relationships'}</span>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 flex items-center space-x-1">
                <span>{char.relationships.filter(r => r.isAlive).length} {language === 'de' ? 'Personen' : 'People'}</span>
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => { sound.playClick(); onOpenTab('career'); }}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 text-left transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'de' ? 'Karriere & Schule' : 'Career & Edu'}</span>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 truncate">
                {char.career.currentJob ? char.career.currentJob.title[language] || char.career.currentJob.title.de : (language === 'de' ? 'Jobsuche / Schule' : 'Job / School')}
              </p>
            </div>
            <Briefcase className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0" />
          </button>

          <button
            onClick={() => { sound.playClick(); onOpenTab('finances'); }}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 text-left transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'de' ? 'Finanzen & Lotto' : 'Finances & Lottery'}</span>
              <p className="text-xs font-mono font-bold text-emerald-400 truncate">
                {char.country.currencySymbol}{char.finances.bankBalance.toLocaleString()}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => { sound.playClick(); onOpenTab('health'); }}
            className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 text-left transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'de' ? 'Arzt & Wellness' : 'Doctor & Health'}</span>
              <p className="text-xs font-semibold text-rose-400 flex items-center space-x-1">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>{char.attributes.health}% {language === 'de' ? 'Gesundheit' : 'Health'}</span>
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Life Log / Chronik */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base">
            <BookOpen className="w-5 h-5" />
            <span>{language === 'de' ? 'Lebenschronik & Logbuch' : 'Life Chronicle & Logbook'}</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono font-normal">
              {char.log.length} {language === 'de' ? 'Einträge' : 'entries'}
            </span>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
            {[
              { id: 'all', label: language === 'de' ? 'Alle' : 'All' },
              { id: 'major', label: language === 'de' ? 'Meilensteine' : 'Milestones' },
              { id: 'good', label: language === 'de' ? 'Positiv' : 'Good' },
              { id: 'bad', label: language === 'de' ? 'Negativ' : 'Bad' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { sound.playClick(); setFilter(f.id); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  filter === f.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              {language === 'de' ? 'Keine Einträge für diesen Filter gefunden.' : 'No entries found for this filter.'}
            </div>
          ) : (
            filteredLogs.map(log => (
              <div
                key={log.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3.5 ${
                  log.type === 'major'
                    ? 'bg-purple-950/30 border-purple-800/50 shadow-sm'
                    : log.type === 'good'
                    ? 'bg-emerald-950/20 border-emerald-900/40'
                    : log.type === 'bad' || log.type === 'death'
                    ? 'bg-rose-950/30 border-rose-900/50 shadow-sm'
                    : log.type === 'achievement'
                    ? 'bg-amber-950/30 border-amber-800/50 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80'
                }`}
              >
                <div className="shrink-0 pt-0.5">
                  <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                    {log.age} {language === 'de' ? 'J.' : 'y.'}
                  </span>
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 font-mono">Jahr {log.year}</span>
                    {getLogBadge(log.type)}
                  </div>
                  <p className={`text-sm leading-relaxed ${log.type === 'death' ? 'text-rose-200 font-bold' : log.type === 'achievement' ? 'text-amber-200 font-semibold' : 'text-slate-200'}`}>
                    {log.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
