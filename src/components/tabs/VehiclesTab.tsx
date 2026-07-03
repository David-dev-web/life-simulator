import React, { useState } from 'react';
import type { Character, Vehicle } from '../../types/game';
import { VEHICLES } from '../../data/vehicles';
import { Car, Wrench, Navigation} from 'lucide-react';
import { sound } from '../../utils/sound';
import { addLogEntry } from '../../utils/engine';

interface VehiclesTabProps {
  char: Character;
  onUpdateCharacter: (char: Character) => void;
  language: 'de' | 'en';
}

export const VehiclesTab: React.FC<VehiclesTabProps> = ({ char, onUpdateCharacter, language }) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const handleBuyVehicle = (vehBase: typeof VEHICLES[0]) => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const cost = Math.round(vehBase.price * c.country.salaryMultiplier);

    if (c.finances.bankBalance < cost) {
      alert(language === 'de' ? 'Nicht genug Geld auf dem Konto!' : 'Not enough money in your account!');
      return;
    }
    if (c.crime.inPrison) {
      alert(language === 'de' ? 'Du kannst aus dem Gefängnis heraus keine Fahrzeuge kaufen!' : 'You cannot buy vehicles while in prison!');
      return;
    }

    c.finances.bankBalance -= cost;
    const newVeh: Vehicle = {
      ...vehBase,
      id: vehBase.id + '_' + Date.now(),
      price: cost,
      yearlyMaintenance: Math.round(vehBase.yearlyMaintenance * c.country.salaryMultiplier),
      condition: 100,
      isOwned: true
    };

    c.vehicles.push(newVeh);
    c.attributes.happiness = Math.min(100, c.attributes.happiness + 15);
    addLogEntry(c, {
      de: `🏎️ GLÜCKWUNSCH! Du hast das Fahrzeug "${vehBase.title.de}" für ${cost.toLocaleString()} € gekauft!`,
      en: `🏎️ CONGRATULATIONS! You bought the vehicle "${vehBase.title.en}" for ${cost.toLocaleString()} €!`
    }, 'good', language);

    onUpdateCharacter(c);
  };

  const handleSellVehicle = (id: string) => {
    if (!confirm(language === 'de' ? 'Willst du dieses Fahrzeug wirklich verkaufen?' : 'Do you really want to sell this vehicle?')) return;
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const idx = c.vehicles.findIndex(v => v.id === id);
    if (idx === -1) return;
    const v = c.vehicles[idx];

    const sellPrice = Math.round(v.price * (v.condition / 100) * 0.85);
    c.finances.bankBalance += sellPrice;
    c.vehicles.splice(idx, 1);

    addLogEntry(c, {
      de: `💰 Du hast dein Fahrzeug "${v.title.de}" für ${sellPrice.toLocaleString()} € verkauft.`,
      en: `💰 You sold your vehicle "${v.title.en}" for ${sellPrice.toLocaleString()} €.`
    }, 'info', language);

    onUpdateCharacter(c);
  };

  const handleRepairVehicle = (id: string) => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const v = c.vehicles.find(v => v.id === id);
    if (!v) return;

    if (v.condition >= 100) {
      alert(language === 'de' ? 'Dieses Fahrzeug ist bereits in perfektem Zustand!' : 'This vehicle is already in perfect condition!');
      return;
    }

    const cost = Math.round((100 - v.condition) * 50 * c.country.salaryMultiplier);
    if (c.finances.bankBalance < cost) {
      alert(language === 'de' ? `Du benötigst ${cost.toLocaleString()} € für die Wartung!` : `You need ${cost.toLocaleString()} € for maintenance!`);
      return;
    }

    c.finances.bankBalance -= cost;
    v.condition = 100;
    addLogEntry(c, {
      de: `🛠️ Du hast das Fahrzeug "${v.title.de}" für ${cost.toLocaleString()} € gewartet und repariert!`,
      en: `🛠️ You maintained and repaired "${v.title.en}" for ${cost.toLocaleString()} €!`
    }, 'good', language);

    onUpdateCharacter(c);
  };

  const handleRideVehicle = (id: string) => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const v = c.vehicles.find(v => v.id === id);
    if (!v) return;

    const bonus = 8;
    c.attributes.happiness = Math.min(100, c.attributes.happiness + bonus);
    c.attributes.stress = Math.max(0, c.attributes.stress - 8);
    v.condition = Math.max(10, v.condition - 2);

    addLogEntry(c, {
      de: `🛣️ Du hast eine aufregende Ausfahrt mit deinem "${v.title.de}" gemacht! (+${bonus}% Glück).`,
      en: `🛣️ You went for an exciting ride in your "${v.title.en}"! (+${bonus}% happiness).`
    }, 'good', language);

    onUpdateCharacter(c);
  };

  const ownedVehicles = char.vehicles.filter(v => v.isOwned);
  const filteredCatalog = VEHICLES.filter(v => selectedCat === 'all' || v.category === selectedCat);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Info */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{language === 'de' ? 'Fahrzeuge & Fuhrpark' : 'Vehicles & Garage'}</h2>
            <p className="text-xs text-slate-400">
              {language === 'de' ? 'Fahrräder, Roller, Autos, Sportwagen, Luxus-Yachten und Privatjets.' : 'Bikes, scooters, cars, sports cars, luxury yachts and private jets.'}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-purple-300 font-mono font-bold text-xs">
          {ownedVehicles.length} {language === 'de' ? 'Fahrzeuge im Besitz' : 'Vehicles Owned'}
        </div>
      </div>

      {/* Owned Vehicles List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 px-1">{language === 'de' ? 'Dein Fuhrpark' : 'Your Garage'} ({ownedVehicles.length})</h3>
        {ownedVehicles.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-slate-500 text-sm border border-slate-800">
            {language === 'de' ? 'Du besitzt noch keine Fahrzeuge. Wähle unten im Katalog eines zum Kauf aus!' : 'You own no vehicles yet. Select one from the catalog below to purchase!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ownedVehicles.map(veh => (
              <div key={veh.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                        {veh.category.toUpperCase()}
                      </span>
                      <h4 className="font-bold text-slate-100 text-base mt-1">{veh.title[language] || veh.title.de}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono font-extrabold text-white">{veh.price.toLocaleString()} €</p>
                      <span className="text-[10px] font-mono text-slate-400">Zustand: {veh.condition}%</span>
                    </div>
                  </div>

                  {/* Condition Progress bar */}
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${veh.condition > 70 ? 'bg-emerald-500' : veh.condition > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${veh.condition}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-400 font-mono pt-1">
                    {language === 'de' ? 'Wartung / Jahr' : 'Maintenance / yr'}: <strong className="text-rose-400">-{veh.yearlyMaintenance.toLocaleString()} €</strong>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleRideVehicle(veh.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{language === 'de' ? 'Ausfahrt machen' : 'Go for a Ride'}</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    {veh.condition < 95 && (
                      <button
                        onClick={() => handleRepairVehicle(veh.id)}
                        className="p-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 transition-colors text-xs"
                        title="Wartung & Reparatur"
                      >
                        <Wrench className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleSellVehicle(veh.id)}
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

      {/* Vehicle Catalog */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Car className="w-5 h-5 text-purple-400" />
            <span>{language === 'de' ? 'Fahrzeugmarkt - Katalog' : 'Vehicle Market - Catalog'}</span>
          </h3>

          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'all', label: language === 'de' ? 'Alle' : 'All' },
              { id: 'bike', label: language === 'de' ? 'Fahrräder' : 'Bikes' },
              { id: 'scooter', label: language === 'de' ? 'Roller' : 'Scooters' },
              { id: 'car', label: language === 'de' ? 'Autos & SUVs' : 'Cars' },
              { id: 'sports', label: language === 'de' ? 'Sportwagen' : 'Sports Cars' },
              { id: 'luxury', label: language === 'de' ? 'Yachten & Jets' : 'Yachts & Jets' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { sound.playClick(); setSelectedCat(cat.id); }}
                className={`px-3 py-1 rounded-xl transition-colors shrink-0 ${
                  selectedCat === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCatalog.map(veh => {
            const priceLocal = Math.round(veh.price * char.country.salaryMultiplier);
            const maintLocal = Math.round(veh.yearlyMaintenance * char.country.salaryMultiplier);
            const canAfford = char.finances.bankBalance >= priceLocal;

            return (
              <div key={veh.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3 transition-all">
                <div className="space-y-1">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                      {veh.category.toUpperCase()}
                    </span>
                    <span className={`text-xs font-mono font-bold ${canAfford ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {priceLocal.toLocaleString()} €
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm mt-1">{veh.title[language] || veh.title.de}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Wartung: -{maintLocal.toLocaleString()} € / Jahr
                  </p>
                </div>

                <button
                  onClick={() => handleBuyVehicle(veh)}
                  disabled={!canAfford}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors shadow-sm"
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
