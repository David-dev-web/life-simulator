import React, { useState } from 'react';
import type { Character, Job, EducationLevel } from '../../types/game';
import { JOBS } from '../../data/jobs';
import { EDUCATION_LEVELS, STUDY_FIELDS } from '../../data/education';
import { Briefcase, GraduationCap, TrendingUp, DollarSign, Zap, AlertCircle, CheckCircle2, Award,  } from 'lucide-react';
import { sound } from '../../utils/sound';
import { addLogEntry } from '../../utils/engine';

interface CareerTabProps {
  char: Character;
  onUpdateCharacter: (char: Character) => void;
  language: 'de' | 'en';
}

export const CareerTab: React.FC<CareerTabProps> = ({ char, onUpdateCharacter, language }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleApplyForJob = (job: Job) => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;

    if (c.age < 16) {
      alert(language === 'de' ? 'Du bist noch zu jung zum Arbeiten!' : 'You are too young to work!');
      return;
    }
    if (c.crime.inPrison) {
      alert(language === 'de' ? 'Du kannst aus dem Gefängnis heraus keinen Job antreten!' : 'You cannot take a job while in prison!');
      return;
    }

    // Check education
    const eduRanks: Record<EducationLevel, number> = {
      none: 0, kindergarten: 1, elementary: 2, middle_school: 3, high_school: 4, vocational: 5, university: 6, doctorate: 7
    };
    const userRank = eduRanks[c.education.currentLevel] || 0;
    const reqRank = eduRanks[job.minEducation] || 0;

    if (userRank < reqRank && !c.education.completedLevels.includes(job.minEducation)) {
      alert(language === 'de'
        ? `Benötigter Bildungsabschluss: ${EDUCATION_LEVELS[job.minEducation].title.de}`
        : `Required education: ${EDUCATION_LEVELS[job.minEducation].title.en}`);
      return;
    }

    if (job.requiredField && c.education.fieldOfStudy !== job.requiredField) {
      const fieldObj = STUDY_FIELDS.find(f => f.id === job.requiredField);
      alert(language === 'de'
        ? `Benötigte Fachrichtung im Studium: ${fieldObj?.name.de || job.requiredField}`
        : `Required study field: ${fieldObj?.name.en || job.requiredField}`);
      return;
    }

    // Check attributes
    if (c.attributes.intelligence < job.minIntelligence) {
      alert(language === 'de'
        ? `Zu geringe Intelligenz! Benötigt: ${job.minIntelligence}%, du hast: ${c.attributes.intelligence}%`
        : `Intelligence too low! Required: ${job.minIntelligence}%, you have: ${c.attributes.intelligence}%`);
      return;
    }
    if (c.attributes.looks < job.minLooks) {
      alert(language === 'de'
        ? `Zu geringes Aussehen / Auftreten! Benötigt: ${job.minLooks}%`
        : `Looks too low! Required: ${job.minLooks}%`);
      return;
    }
    if (c.attributes.discipline < job.minDiscipline) {
      alert(language === 'de'
        ? `Zu geringe Disziplin / Zuverlässigkeit! Benötigt: ${job.minDiscipline}%`
        : `Discipline too low! Required: ${job.minDiscipline}%`);
      return;
    }

    // Success!
    if (c.career.currentJob) {
      if (c.career.currentJob) { c.career.jobHistory.push(c.career.currentJob.title[language] || c.career.currentJob.title.de); }
    }
    c.career.currentJob = job;
    c.career.salary = job.baseSalary;
    c.career.yearsInJob = 0;
    c.career.performance = 75;
    c.career.isUnemployed = false;
    c.career.hasRetired = false;

    addLogEntry(c, {
      de: `💼 GLÜCKWUNSCH! Du hast den Job als "${job.title.de}" angetreten! (Startgehalt: ${(job.baseSalary * c.country.salaryMultiplier).toLocaleString()} €/Jahr).`,
      en: `💼 CONGRATULATIONS! You got the job as "${job.title.en}"! (Starting salary: ${(job.baseSalary * c.country.salaryMultiplier).toLocaleString()} €/yr).`
    }, 'major', language);

    onUpdateCharacter(c);
  };

  const handleAskForRaise = () => {
    if (!char.career.currentJob) return;
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;

    if (c.career.performance < 70) {
      addLogEntry(c, {
        de: '❌ Dein Chef hat die Gehaltserhöhung abgelehnt: "Deine Arbeitsleistung war in letzter Zeit nicht überzeugend!"',
        en: '❌ Your boss rejected the raise: "Your recent performance wasn\'t convincing enough!"'
      }, 'bad', language);
      c.career.performance = Math.max(0, c.career.performance - 10);
    } else {
      const raisePercent = 0.15;
      c.career.salary = Math.round(c.career.salary * (1 + raisePercent));
      c.career.performance = Math.max(0, c.career.performance - 15);
      addLogEntry(c, {
        de: `💰 ERFOLG! Dein Chef war von deinem Engagement begeistert und hat dein Gehalt um 15% auf ${(c.career.salary * c.country.salaryMultiplier).toLocaleString()} € erhöht!`,
        en: `💰 SUCCESS! Your boss was impressed and raised your salary by 15% to ${(c.career.salary * c.country.salaryMultiplier).toLocaleString()} €!`
      }, 'good', language);
    }
    onUpdateCharacter(c);
  };

  const handleOverwork = () => {
    if (!char.career.currentJob && !char.education.isStudying) return;
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;

    if (c.career.currentJob) {
      c.career.performance = Math.min(100, c.career.performance + 18);
      c.attributes.stress = Math.min(100, c.attributes.stress + 15);
      c.attributes.energy = Math.max(0, c.attributes.energy - 15);
      addLogEntry(c, {
        de: '⏰ Du hast unzählige Überstunden im Büro verbracht (+18% Arbeitsleistung, aber +15% Stress).',
        en: '⏰ You worked endless overtime at the office (+18% performance, but +15% stress).'
      }, 'info', language);
    } else if (c.education.isStudying) {
      c.education.grade = Math.min(100, c.education.grade + 15);
      c.attributes.intelligence = Math.min(100, c.attributes.intelligence + 5);
      c.attributes.stress = Math.min(100, c.attributes.stress + 12);
      addLogEntry(c, {
        de: '📚 Du hast die ganze Nacht in der Bibliothek gebüffelt (+15% Schulleistung).',
        en: '📚 You crammed all night in the library (+15% school performance).'
      }, 'good', language);
    }
    onUpdateCharacter(c);
  };

  const handleResign = () => {
    if (!char.career.currentJob) return;
    if (!confirm(language === 'de' ? 'Willst du deinen Job wirklich kündigen und arbeitslos werden?' : 'Really resign from your job and become unemployed?')) return;
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;

    if (c.career.currentJob) { c.career.jobHistory.push(c.career.currentJob.title[language] || c.career.currentJob.title.de); }
    addLogEntry(c, {
      de: `🚪 Du hast deinen Job als "${c.career.currentJob?.title.de || 'Job'}" gekündigt und bist jetzt arbeitslos.`,
      en: `🚪 You resigned from your job as "${c.career.currentJob?.title.en || 'Job'}" and are now unemployed.`
    }, 'info', language);

    c.career.currentJob = undefined;
    c.career.salary = 0;
    c.career.isUnemployed = true;
    onUpdateCharacter(c);
  };

  const handleRetire = () => {
    if (char.age < 60) {
      alert(language === 'de' ? 'Du kannst erst ab 60 Jahren in Rente gehen!' : 'You can only retire at age 60 or later!');
      return;
    }
    if (!confirm(language === 'de' ? 'Willst du in den wohlverdienten Ruhestand gehen?' : 'Do you want to retire?')) return;
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;

    const pensionAmount = Math.round((c.career.salary || 40000) * 0.65);
    if (c.career.currentJob) {
      if (c.career.currentJob) { c.career.jobHistory.push(c.career.currentJob.title[language] || c.career.currentJob.title.de); }
    }
    c.career.currentJob = undefined;
    c.career.hasRetired = true;
    c.career.pension = pensionAmount;
    c.career.isUnemployed = false;
    c.attributes.stress = Math.max(0, c.attributes.stress - 40);

    addLogEntry(c, {
      de: `🌴 RUHESTAND! Du bist in Rente gegangen. Deine monatliche Rente beträgt ca. ${Math.round((pensionAmount * c.country.salaryMultiplier) / 12).toLocaleString()} €/Monat!`,
      en: `🌴 RETIREMENT! You retired. Your pension is ca. ${Math.round((pensionAmount * c.country.salaryMultiplier) / 12).toLocaleString()} €/month!`
    }, 'major', language);

    onUpdateCharacter(c);
  };

  const handleEnrollUniversity = (fieldId: string) => {
    sound.playClick();
    const field = STUDY_FIELDS.find(f => f.id === fieldId);
    if (!field) return;

    const c = JSON.parse(JSON.stringify(char)) as Character;
    if (!c.education.completedLevels.includes('high_school')) {
      alert(language === 'de' ? 'Du benötigst ein Abitur / Gymnasium-Abschluss!' : 'You need a High School diploma!');
      return;
    }
    if (c.attributes.intelligence < field.minInt) {
      alert(language === 'de' ? `Zu geringe Intelligenz für dieses Fach! Benötigt: ${field.minInt}%` : `Intelligence too low for this major! Required: ${field.minInt}%`);
      return;
    }

    c.education.currentLevel = 'university';
    c.education.fieldOfStudy = field.id;
    c.education.yearsInCurrentLevel = 0;
    c.education.isStudying = true;
    c.education.grade = 80;

    addLogEntry(c, {
      de: `🎓 Du hast dich an der Universität für das Studium "${field.name.de}" eingeschrieben!`,
      en: `🎓 You enrolled at University to study "${field.name.en}"!`
    }, 'good', language);

    onUpdateCharacter(c);
  };

  const filteredJobs = JOBS.filter(job => {
    if (selectedCategory !== 'all' && job.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchDe = job.title.de.toLowerCase().includes(q);
      const matchEn = job.title.en.toLowerCase().includes(q);
      return matchDe || matchEn;
    }
    return true;
  });

  const categories = [
    { id: 'all', label: language === 'de' ? 'Alle Berufe (35+)' : 'All Jobs (35+)' },
    { id: 'business', label: language === 'de' ? 'Wirtschaft & Management' : 'Business' },
    { id: 'tech', label: language === 'de' ? 'IT, Software & Wissenschaft' : 'Tech & Science' },
    { id: 'medical', label: language === 'de' ? 'Medizin & Pflege' : 'Medical' },
    { id: 'legal', label: language === 'de' ? 'Jura & Recht' : 'Legal' },
    { id: 'creative', label: language === 'de' ? 'Medien, Kunst & Musik' : 'Creative & Media' },
    { id: 'public', label: language === 'de' ? 'Polizei, Staat & Schule' : 'Public Service' },
    { id: 'craft', label: language === 'de' ? 'Handwerk & Bau' : 'Craft & Construction' },
    { id: 'service', label: language === 'de' ? 'Dienstleistung & Gastro' : 'Service & Dining' },
    { id: 'sports', label: language === 'de' ? 'Sport & Athletik' : 'Sports' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Current Status Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Current Job or School */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
              <Briefcase className="w-4 h-4" />
              <span>{language === 'de' ? 'Aktueller Berufsstatus' : 'Current Career Status'}</span>
            </div>

            {char.career.currentJob ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white">{char.career.currentJob.title[language] || char.career.currentJob.title.de}</h3>
                  <span className="text-emerald-400 font-mono font-extrabold text-lg">
                    {char.country.currencySymbol}{(char.career.salary * char.country.salaryMultiplier).toLocaleString()} / {language === 'de' ? 'Jahr' : 'yr'}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-slate-300">
                  <span>⏳ {char.career.yearsInJob} {language === 'de' ? 'Jahre im Amt' : 'years in role'}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{language === 'de' ? 'Leistung' : 'Performance'}: <strong className="text-white">{char.career.performance}%</strong></span>
                  </span>
                </div>

                {/* Progress bar performance */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${char.career.performance}%` }}
                  />
                </div>
              </div>
            ) : char.career.hasRetired ? (
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-amber-300 flex items-center space-x-2">
                  <span>🌴 {language === 'de' ? 'Im Ruhestand' : 'Retired'}</span>
                </h3>
                <p className="text-sm text-slate-300">
                  {language === 'de' ? 'Monatliche Rente' : 'Monthly Pension'}: <strong className="text-emerald-400 font-mono">{char.country.currencySymbol}{Math.round((char.career.pension * char.country.salaryMultiplier) / 12).toLocaleString()}</strong>
                </p>
              </div>
            ) : char.education.isStudying ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-purple-300 flex items-center space-x-2">
                    <GraduationCap className="w-6 h-6" />
                    <span>{EDUCATION_LEVELS[char.education.currentLevel].title[language] || EDUCATION_LEVELS[char.education.currentLevel].title.de}</span>
                  </h3>
                  <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30">
                    {language === 'de' ? 'Studium / Schule' : 'Study / School'}
                  </span>
                </div>
                {char.education.fieldOfStudy && (
                  <p className="text-xs text-indigo-300 font-bold">
                    {language === 'de' ? 'Fachrichtung' : 'Major'}: {STUDY_FIELDS.find(f => f.id === char.education.fieldOfStudy)?.name[language]}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-xs text-slate-300">
                  <span>⏳ {char.education.yearsInCurrentLevel} {language === 'de' ? 'Jahre' : 'years'}</span>
                  <span>•</span>
                  <span>{language === 'de' ? 'Notenschnitt / Fleiß' : 'Grade / Effort'}: <strong className="text-emerald-400 font-mono">{char.education.grade}%</strong></span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-400 flex items-center space-x-2">
                  <span>🚶 {language === 'de' ? 'Arbeitslos & auf Jobsuche' : 'Unemployed & Job Hunting'}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'de' ? 'Wähle unten einen Beruf aus der Stellenbörse aus, um dich zu bewerben!' : 'Select a career from the job board below to apply!'}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
            {(char.career.currentJob || char.education.isStudying) && (
              <button
                onClick={handleOverwork}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{char.career.currentJob ? (language === 'de' ? 'Überstunden machen (+Leistung)' : 'Work Overtime (+Perf)') : (language === 'de' ? 'Intensiv lernen (+Note)' : 'Study Hard (+Grade)')}</span>
              </button>
            )}

            {char.career.currentJob && (
              <>
                <button
                  onClick={handleAskForRaise}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{language === 'de' ? 'Gehaltserhöhung fordern' : 'Ask for Raise'}</span>
                </button>

                <button
                  onClick={handleResign}
                  className="py-3 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 font-semibold text-xs transition-all flex items-center justify-center space-x-1"
                >
                  <span>{language === 'de' ? 'Kündigen' : 'Resign'}</span>
                </button>
              </>
            )}

            {!char.career.hasRetired && char.age >= 60 && (
              <button
                onClick={handleRetire}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/20"
              >
                <Award className="w-4 h-4" />
                <span>{language === 'de' ? 'In Rente gehen (Ruhestand)' : 'Retire (Pension)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Education History Summary */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center space-x-3 overflow-x-auto text-xs text-slate-400">
          <span className="font-bold text-slate-300 shrink-0">{language === 'de' ? 'Abschlüsse:' : 'Degrees:'}</span>
          {char.education.completedLevels.filter(l => l !== 'none').map(l => (
            <span key={l} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300 font-semibold shrink-0 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{EDUCATION_LEVELS[l].title[language] || EDUCATION_LEVELS[l].title.de}</span>
            </span>
          ))}
        </div>
      </div>

      {/* University Enrollment Section (if Abitur finished & not studying/working fulltime) */}
      {!char.education.isStudying && char.education.completedLevels.includes('high_school') && char.age < 50 && (
        <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-slate-900/80 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-purple-300 font-bold">
            <GraduationCap className="w-5 h-5" />
            <span>{language === 'de' ? 'Stellenbörse Universität - Studium beginnen' : 'University Portal - Enroll in a Degree'}</span>
          </div>
          <p className="text-xs text-slate-300">
            {language === 'de' ? 'Ein Universitätsstudium schaltet hochbezahlte akademische Berufe (Arzt, Anwalt, CTO, Professor) frei.' : 'A university degree unlocks top-paying academic careers (Doctor, Lawyer, CTO, Professor).'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {STUDY_FIELDS.map(f => (
              <button
                key={f.id}
                onClick={() => handleEnrollUniversity(f.id)}
                className="p-3 rounded-xl bg-slate-900/90 hover:bg-purple-900/50 border border-slate-800 hover:border-purple-500 text-left transition-all group"
              >
                <h4 className="font-bold text-xs text-slate-100 group-hover:text-white truncate">{f.name[language] || f.name.de}</h4>
                <p className="text-[10px] text-slate-400 mt-1">Min. Int: {f.minInt}%</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Job Market / Stellenbörse */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>{language === 'de' ? 'Stellenbörse & Karriereangebote (35+ Berufe)' : 'Job Board & Career Opportunities (35+ Jobs)'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'de' ? 'Erfülle die Anforderungen an Bildung, Intelligenz, Aussehen und Disziplin.' : 'Meet the requirements for education, intelligence, looks, and discipline.'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'de' ? 'Beruf suchen...' : 'Search jobs...'}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-48"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs font-semibold">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { sound.playClick(); setSelectedCategory(cat.id); }}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1.5">
          {filteredJobs.map(job => {
            const isCurrent = char.career.currentJob?.id === job.id;
            const salaryLocal = Math.round(job.baseSalary * char.country.salaryMultiplier);
            const hasEdu = char.education.completedLevels.includes(job.minEducation) || job.minEducation === 'none';

            return (
              <div
                key={job.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between glass-panel ${
                  isCurrent
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-md'
                    : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                        {job.category.toUpperCase()}
                      </span>
                      <h4 className="font-bold text-slate-100 text-sm mt-1">{job.title[language] || job.title.de}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-mono font-extrabold text-emerald-400">
                        {char.country.currencySymbol}{salaryLocal.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-slate-500">{language === 'de' ? '/ Jahr' : '/ yr'}</p>
                    </div>
                  </div>

                  {/* Requirements List */}
                  <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950/70 p-2.5 rounded-xl border border-slate-900">
                    <div className="flex items-center justify-between">
                      <span>{language === 'de' ? 'Bildung' : 'Edu'}:</span>
                      <span className={`font-semibold ${hasEdu ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {EDUCATION_LEVELS[job.minEducation].title[language] || EDUCATION_LEVELS[job.minEducation].title.de}
                      </span>
                    </div>
                    {job.requiredField && (
                      <div className="flex items-center justify-between">
                        <span>{language === 'de' ? 'Fachrichtung' : 'Major'}:</span>
                        <span className="text-purple-300 font-semibold">{STUDY_FIELDS.find(f => f.id === job.requiredField)?.name[language]}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between font-mono">
                      <span>Int: {job.minIntelligence}%</span>
                      <span>Aus: {job.minLooks}%</span>
                      <span>Disz: {job.minDiscipline}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3 text-orange-400" />
                    <span>Stress: ~{job.stressLevel}%</span>
                  </span>

                  {isCurrent ? (
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-800/50 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'de' ? 'Dein Job' : 'Current Role'}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyForJob(job)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-sm shadow-indigo-600/20"
                    >
                      {language === 'de' ? 'Bewerben' : 'Apply'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
