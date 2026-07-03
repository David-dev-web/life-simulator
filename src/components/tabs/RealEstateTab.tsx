import React, { useState } from 'react';
import type { Character, Property } from '../../types/game';
import { PROPERTIES } from '../../data/properties';
import { Home, CheckCircle2, Wrench, Building} from 'lucide-react';
import { sound } from '../../utils/sound';
import { addLogEntry } from '../../utils/engine';

interface RealEstateTabProps {
  char: Character;
  onUpdateCharacter: (char: Character) => void;
  language: 'de' | 'en';
}

export const RealEstateTab: React.FC<RealEstateTabProps> = ({ char, onUpdateCharacter, language }) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const handleBuyProperty = (propBase: typeof PROPERTIES[0]) => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const cost = Math.round(propBase.price * c.country.salaryMultiplier);

    if (c.finances.bankBalance < cost) {
      alert(language === 'de' ? 'Nicht genug Geld auf dem Konto!' : 'Not enough money in your account!');
      return;
    }
    if (c.crime.inPrison) {
      alert(language === 'de' ? 'Du kannst aus dem Gefängnis heraus keine Immobilien kaufen!' : 'You cannot buy properties while in prison!');
      return;
    }

    c.finances.bankBalance -= cost;
    const newProp: Property = {
      ...propBase,
      id: propBase.id + '_' + Date.now(),
      price: cost,
      yearlyMaintenance: Math.round(propBase.yearlyMaintenance * c.country.salaryMultiplier),
      yearlyRentIncome: Math.round(propBase.yearlyRentIncome * c.country.salaryMultiplier),
      condition: 100,
      isOwned: true,
      isRentedOut: false,
      isLivingHere: c.properties.filter(p => p.isOwned && p.isLivingHere).length === 0 // Wohnsitz falls erster Kauf
    };

    c.properties.push(newProp);
    c.attributes.happiness = Math.min(100, c.attributes.happiness + 20);
    addLogEntry(c, {
      de: `🏠 GLÜCKWUNSCH! Du hast die Immobilie "${propBase.title.de}" für ${cost.toLocaleString()} € gekauft!`,
      en: `🏠 CONGRATULATIONS! You bought the property "${propBase.title.en}" for ${cost.toLocaleString()} €!`
    }, 'major', language);

    onUpdateCharacter(c);
  };

  const handleSellProperty = (id: string) => {
    if (!confirm(language === 'de' ? 'Willst du diese Immobilie wirklich verkaufen?' : 'Do you really want to sell this property?')) return;
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const idx = c.properties.findIndex(p => p.id === id);
    if (idx === -1) return;
    const p = c.properties[idx];

    const sellPrice = Math.round(p.price * (p.condition / 100) * 0.95);
    c.finances.bankBalance += sellPrice;
    c.properties.splice(idx, 1);

    addLogEntry(c, {
      de: `💰 Du hast deine Immobilie "${p.title.de}" für ${sellPrice.toLocaleString()} € verkauft.`,
      en: `💰 You sold your property "${p.title.en}" for ${sellPrice.toLocaleString()} €.`
    }, 'info', language);

    onUpdateCharacter(c);
  };

  const handleToggleRent = (id: string) => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const p = c.properties.find(p => p.id === id);
    if (!p) return;

    if (p.isLivingHere && !p.isRentedOut) {
      alert(language === 'de' ? 'Du musst zuerst in eine andere Immobilie umziehen, bevor du deinen Wohnsitz vermietest!' : 'You must move to another property before renting out your primary residence!');
      return;
    }

    p.isRentedOut = !p.isRentedOut;
    addLogEntry(c, {
      de: p.isRentedOut
        ? `🔑 Du vermietest jetzt "${p.title.de}" für ca. ${p.yearlyRentIncome.toLocaleString()} €/Jahr Mieteinnahmen.`
        : `🔑 Du hast das Mietverhältnis für "${p.title.de}" beendet.`,
      en: p.isRentedOut
        ? `🔑 You are now renting out "${p.title.en}" for ca. ${p.yearlyRentIncome.toLocaleString()} €/yr rental income.`
        : `🔑 You ended the tenancy for "${p.title.en}".`
    }, 'info', language);

    onUpdateCharacter(c);
  };

  const handleMoveIn = (id: string) => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    c.properties.forEach(p => {
      p.isLivingHere = p.id === id;
      if (p.id === id && p.isRentedOut) p.isRentedOut = false;
    });

    const target = c.properties.find(p => p.id === id);
    if (target) {
      c.attributes.happiness = Math.min(100, c.attributes.happiness + 10);
      addLogEntry(c, {
        de: `📦 Du bist in deine Immobilie "${target.title.de}" eingezogen!`,
        en: `📦 You moved into your property "${target.title.en}"!`
      }, 'good', language);
    }
    onUpdateCharacter(c);
  };

  const handleRepair = (id: string) => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const p = c.properties.find(p => p.id === id);
    if (!p) return;

    if (p.condition >= 100) {
      alert(language === 'de' ? 'Diese Immobilie ist bereits in perfektem Zustand!' : 'This property is already in perfect condition!');
      return;
    }

    const cost = Math.round((100 - p.condition) * 250 * c.country.salaryMultiplier);
    if (c.finances.bankBalance < cost) {
      alert(language === 'de' ? `Du benötigst ${cost.toLocaleString()} € für die Renovierung!` : `You need ${cost.toLocaleString()} € for renovation!`);
      return;
    }

    c.finances.bankBalance -= cost;
    p.condition = 100;
    addLogEntry(c, {
      de: `🛠️ Du hast die Immobilie "${p.title.de}" für ${cost.toLocaleString()} € komplett saniert!`,
      en: `🛠️ You fully renovated the property "${p.title.en}" for ${cost.toLocaleString()} €!`
    }, 'good', language);

    onUpdateCharacter(c);
  };

  const ownedProperties = char.properties.filter(p => p.isOwned);
  const filteredCatalog = PROPERTIES.filter(p => selectedCat === 'all' || p.category === selectedCat);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{language === 'de' ? 'Immobilien & Grundbesitz' : 'Real Estate & Properties'}</h2>
            <p className="text-xs text-slate-400">
              {language === 'de' ? 'Kaufe Wohnungen, Häuser, Villen und Schlösser. Vermiete sie für passives Einkommen.' : 'Buy apartments, houses, villas and castles. Rent them out for passive income.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono font-bold">
          <div className="bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 text-cyan-300">
            {ownedProperties.length} {language === 'de' ? 'Besitz' : 'Owned'}
          </div>
          <div className="bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-800/50 text-emerald-400">
            +{ownedProperties.filter(p => p.isRentedOut).reduce((acc, p) => acc + p.yearlyRentIncome, 0).toLocaleString()} €/J Miete
          </div>
        </div>
      </div>

      {/* Owned Properties List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 px-1">{language === 'de' ? 'Dein Immobilienbesitz' : 'Your Owned Properties'} ({ownedProperties.length})</h3>
        {ownedProperties.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-500 text-sm border border-slate-800">
            {language === 'de' ? 'Du besitzt noch keine Immobilien. Wähle unten im Katalog eine Immobilie zum Kauf aus!' : 'You own no properties yet. Select a property from the catalog below to purchase!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ownedProperties.map(prop => (
              <div key={prop.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        {prop.category.toUpperCase()}
                      </span>
                      <h4 className="font-bold text-slate-100 text-base mt-1">{prop.title[language] || prop.title.de}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono font-extrabold text-white">{prop.price.toLocaleString()} €</p>
                      <span className="text-[10px] font-mono text-slate-400">Zustand: {prop.condition}%</span>
                    </div>
                  </div>

                  {/* Condition Progress bar */}
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${prop.condition > 70 ? 'bg-emerald-500' : prop.condition > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${prop.condition}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-900">
                      <span className="text-slate-500 text-[10px] block">{language === 'de' ? 'Unterhalt / Jahr' : 'Maintenance / yr'}:</span>
                      <span className="font-mono font-bold text-rose-400">-{prop.yearlyMaintenance.toLocaleString()} €</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-900">
                      <span className="text-slate-500 text-[10px] block">{language === 'de' ? 'Mieteinnahmen' : 'Rent Income'}:</span>
                      <span className="font-mono font-bold text-emerald-400">+{prop.yearlyRentIncome.toLocaleString()} €</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center space-x-1">
                    {prop.isLivingHere ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/50 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'de' ? 'Dein Wohnsitz' : 'Residence'}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMoveIn(prop.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
                      >
                        {language === 'de' ? 'Einziehen' : 'Move In'}
                      </button>
                    )}

                    {!prop.isLivingHere && (
                      <button
                        onClick={() => handleToggleRent(prop.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors border ${
                          prop.isRentedOut
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                        }`}
                      >
                        {prop.isRentedOut ? (language === 'de' ? 'Vermietet ✅' : 'Rented Out ✅') : (language === 'de' ? 'Vermieten' : 'Rent Out')}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {prop.condition < 95 && (
                      <button
                        onClick={() => handleRepair(prop.id)}
                        className="p-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 transition-colors text-xs"
                        title="Sanieren"
                      >
                        <Wrench className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleSellProperty(prop.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 font-semibold text-xs transition-colors"
                    >
                      {language === 'de' ? 'Verkaufen' : 'Sell'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Property Catalog / Immobilienmarkt */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building className="w-5 h-5 text-indigo-400" />
            <span>{language === 'de' ? 'Immobilienmarkt - Katalog' : 'Real Estate Market - Catalog'}</span>
          </h3>

          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'all', label: language === 'de' ? 'Alle' : 'All' },
              { id: 'apartment', label: language === 'de' ? 'Wohnungen' : 'Apartments' },
              { id: 'house', label: language === 'de' ? 'Häuser' : 'Houses' },
              { id: 'villa', label: language === 'de' ? 'Villen & Lofts' : 'Villas' },
              { id: 'luxury', label: language === 'de' ? 'Luxus & Schlösser' : 'Luxury & Castle' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { sound.playClick(); setSelectedCat(cat.id); }}
                className={`px-3 py-1 rounded-xl transition-colors shrink-0 ${
                  selectedCat === cat.id
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCatalog.map(prop => {
            const priceLocal = Math.round(prop.price * char.country.salaryMultiplier);
            const maintLocal = Math.round(prop.yearlyMaintenance * char.country.salaryMultiplier);
            const rentLocal = Math.round(prop.yearlyRentIncome * char.country.salaryMultiplier);
            const canAfford = char.finances.bankBalance >= priceLocal;

            return (
              <div key={prop.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3 transition-all">
                <div className="space-y-1">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      {prop.category.toUpperCase()}
                    </span>
                    <span className={`text-xs font-mono font-bold ${canAfford ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {priceLocal.toLocaleString()} €
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm mt-1">{prop.title[language] || prop.title.de}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Unterhalt: -{maintLocal.toLocaleString()} € | Miete: +{rentLocal.toLocaleString()} €
                  </p>
                </div>

                <button
                  onClick={() => handleBuyProperty(prop)}
                  disabled={!canAfford}
                  className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors shadow-sm"
                >
                  {canAfford ? (language === 'de' ? 'Kaufen!' : 'Buy Now!') : (language === 'de' ? 'Zu teuer' : 'Too Expensive')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
