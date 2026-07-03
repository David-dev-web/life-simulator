import React, { useState } from 'react';
import type { Character, MultiLifeStats } from '../../types/game';
import { ACHIEVEMENTS } from '../../data/achievements';
import { CheckCircle2, Lock, Filter, Trophy } from 'lucide-react';
import { sound } from '../../utils/sound';

interface AchievementsTabProps {
  char: Character;
  stats: MultiLifeStats;
  language: 'de' | 'en';
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ char, language }) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedIds = char.unlockedAchievements;
  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id)).length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filtered = ACHIEVEMENTS.filter(ach => {
    if (selectedCat !== 'all' && ach.category !== selectedCat) return false;
    const isUnlocked = unlockedIds.includes(ach.id);
    if (filterStatus === 'unlocked' && !isUnlocked) return false;
    if (filterStatus === 'locked' && isUnlocked) return false;
    return true;
  });

  const categories = [
    { id: 'all', label: language === 'de' ? 'Alle (50+)' : 'All (50+)' },
    { id: 'wealth', label: language === 'de' ? '💰 Vermögen & Besitz' : '💰 Wealth' },
    { id: 'life', label: language === 'de' ? '⏳ Alter & Werte' : '⏳ Life & Stats' },
    { id: 'family', label: language === 'de' ? '👨‍👩‍👧‍👦 Familie & Liebe' : '👨‍👩‍👧‍👦 Family' },
    { id: 'career', label: language === 'de' ? '💼 Bildung & Beruf' : '💼 Career & Edu' },
    { id: 'crime', label: language === 'de' ? '🦹 Kriminalität' : '🦹 Crime' },
    { id: 'special', label: language === 'de' ? '🌟 Dynastie & Spezial' : '🌟 Special' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Progress Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-slate-950 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-black text-white flex items-center justify-center sm:justify-start space-x-2">
                <span>{language === 'de' ? 'Erfolge & Trophäen' : 'Achievements & Trophies'}</span>
                <span className="text-sm font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {unlockedCount} / {totalCount}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {language === 'de'
                  ? 'Sammle über dein Leben und nachfolgende Generationen hinweg alle 50+ Meilensteine!'
                  : 'Collect all 50+ milestones across your lifetime and future generations!'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-300">
              <span>{language === 'de' ? 'Gesamtfortschritt' : 'Total Progress'}</span>
              <span className="text-amber-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          {/* Categories */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { sound.playClick(); setSelectedCat(cat.id); }}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  selectedCat === cat.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 shrink-0 text-xs font-semibold self-end md:self-center">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
            {[
              { id: 'all', label: language === 'de' ? 'Alle' : 'All' },
              { id: 'unlocked', label: language === 'de' ? 'Freigeschaltet' : 'Unlocked' },
              { id: 'locked', label: language === 'de' ? 'Gesperrt' : 'Locked' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { sound.playClick(); setFilterStatus(f.id as any); }}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterStatus === f.id
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-slate-950 text-slate-500 hover:text-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              {language === 'de' ? 'Keine Erfolge für diese Filterkombination gefunden.' : 'No achievements found for this filter.'}
            </div>
          ) : (
            filtered.map(ach => {
              const isUnlocked = unlockedIds.includes(ach.id);

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-950/30 to-slate-900/90 border-amber-500/50 shadow-md shadow-amber-500/5'
                      : 'bg-slate-900/50 border-slate-800/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                    isUnlocked
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}>
                    {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-500" />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`font-bold text-sm truncate ${isUnlocked ? 'text-amber-200' : 'text-slate-300'}`}>
                        {ach.title[language] || ach.title.de}
                      </h4>
                      {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {ach.description[language] || ach.description.de}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
