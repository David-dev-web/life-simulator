import type { Character, MultiLifeStats, GameSettings } from '../types/game';

const CHAR_KEY = 'vitalog_current_character';
const STATS_KEY = 'vitalog_multilife_stats';
const SETTINGS_KEY = 'vitalog_settings';

export const defaultSettings: GameSettings = {
  language: 'de',
  soundEnabled: true,
  autoSave: true
};

export const defaultStats: MultiLifeStats = {
  totalLivesPlayed: 0,
  totalYearsLived: 0,
  highestNetWorth: 0,
  totalCrimesCommitted: 0,
  totalChildrenHad: 0,
  totalDegreesEarned: 0,
  oldestAgeReached: 0,
  dynastyTree: []
};

export const loadSettings = (): GameSettings => {
  try {
    const item = localStorage.getItem(SETTINGS_KEY);
    return item ? JSON.parse(item) : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: GameSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

export const loadCharacter = (): Character | null => {
  try {
    const item = localStorage.getItem(CHAR_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

export const saveCharacter = (char: Character | null) => {
  try {
    if (char) {
      localStorage.setItem(CHAR_KEY, JSON.stringify(char));
    } else {
      localStorage.removeItem(CHAR_KEY);
    }
  } catch (e) {
    console.error('Failed to save character:', e);
  }
};

export const loadStats = (): MultiLifeStats => {
  try {
    const item = localStorage.getItem(STATS_KEY);
    return item ? JSON.parse(item) : defaultStats;
  } catch {
    return defaultStats;
  }
};

export const saveStats = (stats: MultiLifeStats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
};

export const updateStatsOnDeath = (char: Character) => {
  const stats = loadStats();
  stats.totalLivesPlayed += 1;
  stats.totalYearsLived += char.age;
  stats.highestNetWorth = Math.max(stats.highestNetWorth, char.finances.netWorth);
  stats.totalCrimesCommitted += char.crime.crimesCommitted;
  stats.totalChildrenHad += char.relationships.filter(r => r.type === 'child').length;
  stats.totalDegreesEarned += char.education.completedLevels.filter(l => l !== 'none' && l !== 'kindergarten' && l !== 'elementary').length;
  stats.oldestAgeReached = Math.max(stats.oldestAgeReached, char.age);

  stats.dynastyTree.push({
    name: `${char.firstName} ${char.lastName}`,
    yearsLived: char.age,
    netWorth: char.finances.netWorth,
    jobTitle: char.career.currentJob?.title.de || 'Kein Beruf',
    generation: char.generation || 1
  });

  saveStats(stats);
};

export const exportGameToJSON = (char: Character | null, stats: MultiLifeStats, settings: GameSettings) => {
  const data = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    character: char,
    stats,
    settings
  };
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `vitalog_save_${char ? char.firstName.toLowerCase() + '_' + char.lastName.toLowerCase() : 'backup'}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importGameFromJSONString = (jsonString: string): { char: Character | null; stats: MultiLifeStats; settings: GameSettings } => {
  const data = JSON.parse(jsonString);
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid JSON format');
  }
  if (data.settings) saveSettings(data.settings);
  if (data.stats) saveStats(data.stats);
  if (data.character !== undefined) saveCharacter(data.character);

  return {
    char: data.character || null,
    stats: data.stats || defaultStats,
    settings: data.settings || defaultSettings
  };
};
