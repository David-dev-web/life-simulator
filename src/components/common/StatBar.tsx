import React from 'react';
import type { Attributes } from '../../types/game';
import { Heart, Smile, Brain, Sparkles, Shield, Zap, Battery, Award } from 'lucide-react';

interface StatBarProps {
  attributes: Attributes;
  language: 'de' | 'en';
}

export const StatBar: React.FC<StatBarProps> = ({ attributes, language }) => {
  const stats = [
    {
      key: 'health',
      label: language === 'de' ? 'Gesundheit' : 'Health',
      value: attributes.health,
      icon: Heart,
      color: 'bg-rose-500',
      text: 'text-rose-400'
    },
    {
      key: 'happiness',
      label: language === 'de' ? 'Glück' : 'Happiness',
      value: attributes.happiness,
      icon: Smile,
      color: 'bg-amber-400',
      text: 'text-amber-300'
    },
    {
      key: 'intelligence',
      label: language === 'de' ? 'Intelligenz' : 'Intelligence',
      value: attributes.intelligence,
      icon: Brain,
      color: 'bg-cyan-400',
      text: 'text-cyan-300'
    },
    {
      key: 'looks',
      label: language === 'de' ? 'Aussehen' : 'Looks',
      value: attributes.looks,
      icon: Sparkles,
      color: 'bg-purple-400',
      text: 'text-purple-300'
    },
    {
      key: 'discipline',
      label: language === 'de' ? 'Disziplin' : 'Discipline',
      value: attributes.discipline,
      icon: Shield,
      color: 'bg-emerald-400',
      text: 'text-emerald-300'
    },
    {
      key: 'stress',
      label: language === 'de' ? 'Stress' : 'Stress',
      value: attributes.stress,
      icon: Zap,
      color: 'bg-orange-500',
      text: 'text-orange-400',
      invertWarning: true
    },
    {
      key: 'energy',
      label: language === 'de' ? 'Energie' : 'Energy',
      value: attributes.energy,
      icon: Battery,
      color: 'bg-blue-400',
      text: 'text-blue-300'
    },
    {
      key: 'karma',
      label: language === 'de' ? 'Karma' : 'Karma',
      value: attributes.karma,
      icon: Award,
      color: 'bg-indigo-400',
      text: 'text-indigo-300'
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 shadow-xl border border-slate-800">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isDanger = stat.invertWarning ? stat.value > 75 : stat.value < 25;
          return (
            <div key={stat.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <Icon className={`w-3.5 h-3.5 ${stat.text}`} />
                  <span className="truncate">{stat.label}</span>
                </div>
                <span className={`font-mono ${isDanger ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-200'}`}>
                  {stat.value}%
                </span>
              </div>
              <div className="w-full bg-slate-900/90 h-2 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${stat.color} ${isDanger ? 'animate-pulse shadow-sm shadow-rose-500/50' : ''}`}
                  style={{ width: `${Math.min(100, Math.max(0, stat.value))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
