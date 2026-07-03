import React from 'react';
import type { Character } from '../../types/game';
import { HeartPulse, Stethoscope, CheckCircle2, ShieldAlert } from 'lucide-react';
import { sound } from '../../utils/sound';
import { addLogEntry } from '../../utils/engine';

interface HealthTabProps {
  char: Character;
  onUpdateCharacter: (char: Character) => void;
  language: 'de' | 'en';
}

export const HealthTab: React.FC<HealthTabProps> = ({ char, onUpdateCharacter, language }) => {
  const handleAction = (type: 'gym' | 'meditate' | 'gp' | 'specialist' | 'psych' | 'surgery' | 'alternative') => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;

    switch (type) {
      case 'gym': {
        const cost = Math.round(120 * c.country.salaryMultiplier);
        if (c.finances.bankBalance < cost) {
          alert(language === 'de' ? 'Nicht genug Geld!' : 'Not enough money!');
          return;
        }
        c.finances.bankBalance -= cost;
        c.attributes.health = Math.min(100, c.attributes.health + 8);
        c.attributes.energy = Math.min(100, c.attributes.energy + 12);
        c.attributes.looks = Math.min(100, c.attributes.looks + 3);
        addLogEntry(c, {
          de: `🏋️ Du hast intensiv im Fitnessstudio trainiert (+8% Gesundheit, +12% Energie).`,
          en: `🏋️ You worked out intensely at the gym (+8% health, +12% energy).`
        }, 'good', language);
        break;
      }
      case 'meditate': {
        c.attributes.stress = Math.max(0, c.attributes.stress - 20);
        c.attributes.happiness = Math.min(100, c.attributes.happiness + 6);
        addLogEntry(c, {
          de: `🧘 Du hast eine tiefe Meditations- und Yoga-Einheit absolviert (-20% Stress).`,
          en: `🧘 You completed a deep meditation and yoga session (-20% stress).`
        }, 'good', language);
        break;
      }
      case 'gp': {
        const cost = Math.round(80 * c.country.salaryMultiplier);
        if (c.finances.bankBalance < cost) {
          alert(language === 'de' ? 'Nicht genug Geld!' : 'Not enough money!');
          return;
        }
        c.finances.bankBalance -= cost;
        c.attributes.health = Math.min(100, c.attributes.health + 12);
        addLogEntry(c, {
          de: `🩺 Du warst zur Routine-Untersuchung beim Hausarzt (+12% Gesundheit).`,
          en: `🩺 You went for a routine checkup at the General Practitioner (+12% health).`
        }, 'good', language);
        break;
      }
      case 'specialist': {
        const cost = Math.round(500 * c.country.salaryMultiplier);
        if (c.finances.bankBalance < cost) {
          alert(language === 'de' ? 'Nicht genug Geld!' : 'Not enough money!');
          return;
        }
        c.finances.bankBalance -= cost;
        c.attributes.health = Math.min(100, c.attributes.health + 28);
        if (c.illnesses.length > 0) {
          const cured = c.illnesses.shift();
          addLogEntry(c, {
            de: `🏥 Der Facharzt konnte deine Krankheit "${cured}" erfolgreich behandeln und heilen! (+28% Gesundheit).`,
            en: `🏥 The specialist successfully treated and cured your illness "${cured}"! (+28% health).`
          }, 'good', language);
        } else {
          addLogEntry(c, {
            de: `🏥 Umfassender Gesundheitscheck beim Facharzt: Alle Werte im grünen Bereich (+28% Gesundheit).`,
            en: `🏥 Comprehensive checkup at the specialist: All vitals green (+28% health).`
          }, 'good', language);
        }
        break;
      }
      case 'psych': {
        const cost = Math.round(250 * c.country.salaryMultiplier);
        if (c.finances.bankBalance < cost) {
          alert(language === 'de' ? 'Nicht genug Geld!' : 'Not enough money!');
          return;
        }
        c.finances.bankBalance -= cost;
        c.attributes.stress = Math.max(0, c.attributes.stress - 35);
        c.attributes.happiness = Math.min(100, c.attributes.happiness + 20);
        addLogEntry(c, {
          de: `🛋️ Die Therapie-Sitzung beim Psychologen war sehr wirksam (-35% Stress, +20% Glück).`,
          en: `🛋️ The therapy session with the psychologist was very effective (-35% stress, +20% happiness).`
        }, 'good', language);
        break;
      }
      case 'surgery': {
        const cost = Math.round(4500 * c.country.salaryMultiplier);
        if (c.finances.bankBalance < cost) {
          alert(language === 'de' ? 'Eine Schönheits-OP kostet 4.500 €!' : 'Cosmetic surgery costs 4,500 €!');
          return;
        }
        if (!confirm(language === 'de' ? 'Eine Schönheits-OP birgt Risiken. Trotzdem durchführen (-4.500 €)?' : 'Cosmetic surgery has risks. Proceed anyway (-4,500 €)?')) return;
        c.finances.bankBalance -= cost;
        if (Math.random() > 0.15) {
          c.attributes.looks = Math.min(100, c.attributes.looks + 35);
          addLogEntry(c, {
            de: `✨ DIE OP WAR EIN ERFOLG! Du siehst fantastisch aus (+35% Aussehen).`,
            en: `✨ THE SURGERY WAS A SUCCESS! You look amazing (+35% looks).`
          }, 'good', language);
        } else {
          c.attributes.looks = Math.max(0, c.attributes.looks - 25);
          addLogEntry(c, {
            de: `⚠️ VERPFUSCHTE OP! Der Chirurg hat einen Fehler gemacht. Dein Aussehen hat gelitten (-25% Aussehen).`,
            en: `⚠️ BOTCHED SURGERY! The surgeon made a mistake. Your looks suffered (-25% looks).`
          }, 'bad', language);
        }
        break;
      }
      case 'alternative': {
        const cost = Math.round(90 * c.country.salaryMultiplier);
        if (c.finances.bankBalance < cost) return;
        c.finances.bankBalance -= cost;
        if (Math.random() > 0.5) {
          c.attributes.health = Math.min(100, c.attributes.health + 10);
          c.attributes.happiness = Math.min(100, c.attributes.happiness + 8);
          addLogEntry(c, {
            de: `🌿 Globuli und Kräutertees aus der Alternativmedizin haben geholfen (+10% Gesundheit).`,
            en: `🌿 Homeopathy and herbal teas helped your wellbeing (+10% health).`
          }, 'good', language);
        } else {
          addLogEntry(c, {
            de: `🌿 Die Alternativmedizin hatte leider keinen spürbaren Effekt auf deine Gesundheit.`,
            en: `🌿 The alternative medicine had no noticeable effect on your health.`
          }, 'info', language);
        }
        break;
      }
    }

    onUpdateCharacter(c);
  };

  const actions = [
    {
      id: 'meditate',
      title: language === 'de' ? '🧘 Meditation & Yoga' : '🧘 Meditation & Yoga',
      desc: language === 'de' ? 'Kostenlos • Baut extrem viel Stress ab und bringt innere Ruhe.' : 'Free • Relieves significant stress and brings peace.',
      cost: 0,
      badge: '-20% Stress'
    },
    {
      id: 'gym',
      title: language === 'de' ? '🏋️ Fitnessstudio & Sport' : '🏋️ Gym & Fitness',
      desc: language === 'de' ? 'Stärkt Muskulatur, Ausdauer und körperliche Energie.' : 'Strengthens muscles, endurance, and physical energy.',
      cost: Math.round(120 * char.country.salaryMultiplier),
      badge: '+8% Gesundheit'
    },
    {
      id: 'gp',
      title: language === 'de' ? '🩺 Allgemeinarzt / Hausarzt' : '🩺 General Practitioner',
      desc: language === 'de' ? 'Routine-Checkup bei kleinen Beschwerden und Erkältungen.' : 'Routine checkup for minor ailments and colds.',
      cost: Math.round(80 * char.country.salaryMultiplier),
      badge: '+12% Gesundheit'
    },
    {
      id: 'psych',
      title: language === 'de' ? '🛋️ Psychologe & Therapie' : '🛋️ Psychologist & Therapy',
      desc: language === 'de' ? 'Professionelle Hilfe bei Burnout, Depressionen und hohem Druck.' : 'Professional help for burnout, depression, and stress.',
      cost: Math.round(250 * char.country.salaryMultiplier),
      badge: '-35% Stress'
    },
    {
      id: 'alternative',
      title: language === 'de' ? '🌿 Alternativmedizin & Globuli' : '🌿 Alternative Medicine',
      desc: language === 'de' ? 'Sanfte Heilmethoden, Akupunktur und Heilkräuter.' : 'Gentle healing, acupuncture, and medicinal herbs.',
      cost: Math.round(90 * char.country.salaryMultiplier),
      badge: '50% Chance'
    },
    {
      id: 'specialist',
      title: language === 'de' ? '🏥 Facharzt & Klinik' : '🏥 Specialist & Hospital',
      desc: language === 'de' ? 'Heilt chronische Krankheiten, Verletzungen und schwere Leiden.' : 'Cures chronic illnesses, injuries, and severe conditions.',
      cost: Math.round(500 * char.country.salaryMultiplier),
      badge: 'Heilt Krankheiten'
    },
    {
      id: 'surgery',
      title: language === 'de' ? '✨ Schönheits-OP (Plastische Chirurgie)' : '✨ Plastic Surgery',
      desc: language === 'de' ? 'Dramatische Steigerung der Attraktivität, aber mit OP-Risiko!' : 'Dramatic boost to attractiveness, but carries risk!',
      cost: Math.round(4500 * char.country.salaryMultiplier),
      badge: '+35% Aussehen'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{language === 'de' ? 'Gesundheitssystem & Wellness' : 'Healthcare & Wellness'}</h2>
            <p className="text-xs text-slate-400">
              {language === 'de' ? 'Achte auf dein Wohlbefinden, um 100+ Jahre alt zu werden. Baue Stress rechtzeitig ab!' : 'Take care of your wellbeing to live past 100 years. Manage stress early!'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold">
          <span className="bg-rose-950/50 border border-rose-800/50 text-rose-300 px-3.5 py-2 rounded-xl">
            {char.attributes.health}% {language === 'de' ? 'Gesundheit' : 'Health'}
          </span>
          <span className="bg-orange-950/50 border border-orange-800/50 text-orange-300 px-3.5 py-2 rounded-xl">
            {char.attributes.stress}% {language === 'de' ? 'Stress' : 'Stress'}
          </span>
        </div>
      </div>

      {/* Active Illnesses */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
          <Stethoscope className="w-4 h-4" />
          <span>{language === 'de' ? 'Aktuelle Diagnosen & Krankheiten' : 'Current Diagnoses & Illnesses'}</span>
        </div>
        {char.illnesses.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 text-slate-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{language === 'de' ? 'Du bist aktuell kerngesund und hast keine Krankheiten!' : 'You are currently in perfect health with no illnesses!'}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {char.illnesses.map((ill, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/60 flex items-center justify-between text-xs font-bold text-rose-200">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>{ill}</span>
                </div>
                <button
                  onClick={() => handleAction('specialist')}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
                >
                  {language === 'de' ? 'Beim Facharzt heilen' : 'Treat at Specialist'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Treatments Catalog */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 px-1">{language === 'de' ? 'Behandlungen & Aktivitäten' : 'Treatments & Activities'}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map(act => (
            <div key={act.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-lg flex flex-col justify-between space-y-4 transition-all">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-slate-100 text-sm">{act.title}</h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
                    {act.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{act.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {act.cost === 0 ? (language === 'de' ? 'Kostenlos' : 'Free') : `${act.cost.toLocaleString()} €`}
                </span>
                <button
                  onClick={() => handleAction(act.id as any)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  {language === 'de' ? 'Durchführen' : 'Execute'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
