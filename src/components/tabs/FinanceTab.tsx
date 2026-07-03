import React, { useState } from 'react';
import type { Character, Investment } from '../../types/game';
import { DollarSign, TrendingUp, PiggyBank, CreditCard, Sparkles, Dices, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { sound } from '../../utils/sound';
import { addLogEntry } from '../../utils/engine';

interface FinanceTabProps {
  char: Character;
  onUpdateCharacter: (char: Character) => void;
  language: 'de' | 'en';
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ char, onUpdateCharacter, language }) => {
  const [investType, setInvestType] = useState<'stocks' | 'crypto' | 'gold' | 'real_estate_fund'>('stocks');
  const [investAmount, setInvestAmount] = useState<number>(1000);
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [casinoBet, setCasinoBet] = useState<number>(100);
  const [casinoChoice, setCasinoChoice] = useState<'red' | 'black' | 'green'>('red');
  const [scratchCardResult, setScratchCardResult] = useState<string | null>(null);

  const handleBuyInvestment = () => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    if (c.finances.bankBalance < investAmount || investAmount <= 0) {
      alert(language === 'de' ? 'Nicht genug Geld auf dem Konto!' : 'Not enough money in your account!');
      return;
    }

    c.finances.bankBalance -= investAmount;
    const existing: Investment = c.finances.investments[investType] || {
      type: investType,
      amount: 0,
      purchasePrice: 0,
      currentValue: 0
    };

    existing.amount += investAmount;
    existing.purchasePrice += investAmount;
    existing.currentValue += investAmount;
    c.finances.investments[investType] = existing;

    const names = {
      stocks: language === 'de' ? 'Aktienmarkt (Tech & Global)' : 'Stock Market',
      crypto: language === 'de' ? 'Kryptowährungen (Bitcoin/Ethereum)' : 'Cryptocurrency',
      gold: language === 'de' ? 'Physisches Gold & Edelmetalle' : 'Physical Gold',
      real_estate_fund: language === 'de' ? 'Immobilienfonds (REITs)' : 'Real Estate Fund'
    };

    addLogEntry(c, {
      de: `📈 Du hast ${investAmount.toLocaleString()} € in "${names[investType]}" investiert!`,
      en: `📈 You invested ${investAmount.toLocaleString()} € into "${names[investType]}"!`
    }, 'good', language);

    onUpdateCharacter(c);
  };

  const handleSellInvestment = (type: string) => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const inv = c.finances.investments[type];
    if (!inv || inv.currentValue <= 0) return;

    const profit = inv.currentValue - inv.purchasePrice;
    c.finances.bankBalance += inv.currentValue;
    delete c.finances.investments[type];

    addLogEntry(c, {
      de: `💰 Du hast deine Investition ("${type}") für ${inv.currentValue.toLocaleString()} € verkauft! (${profit >= 0 ? '+' : ''}${profit.toLocaleString()} € Gewinn/Verlust).`,
      en: `💰 You sold your investment ("${type}") for ${inv.currentValue.toLocaleString()} €! (${profit >= 0 ? '+' : ''}${profit.toLocaleString()} € profit/loss).`
    }, profit >= 0 ? 'good' : 'bad', language);

    onUpdateCharacter(c);
  };

  const handleTakeLoan = () => {
    sound.playClick();
    if (loanAmount <= 0) return;
    const c = JSON.parse(JSON.stringify(char)) as Character;

    const maxLoan = Math.max(50000, c.finances.netWorth * 0.5);
    if (loanAmount > maxLoan) {
      alert(language === 'de' ? `Deine Bonität reicht nur für maximal ${maxLoan.toLocaleString()} € Kredit!` : `Your credit rating allows a max loan of ${maxLoan.toLocaleString()} €!`);
      return;
    }

    c.finances.bankBalance += loanAmount;
    c.finances.loans.push({
      id: 'loan_' + Date.now(),
      amount: loanAmount,
      remainingAmount: Math.round(loanAmount * 1.15), // 15% Gesamtzinsen
      interestRate: 0.06,
      yearlyPayment: Math.round((loanAmount * 1.15) / 5) // 5 Jahre Laufzeit
    });

    addLogEntry(c, {
      de: `🏦 Du hast einen Bankkredit über ${loanAmount.toLocaleString()} € aufgenommen.`,
      en: `🏦 You took out a bank loan of ${loanAmount.toLocaleString()} €.`
    }, 'info', language);

    onUpdateCharacter(c);
  };

  const handlePayLoan = (id: string) => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const idx = c.finances.loans.findIndex(l => l.id === id);
    if (idx === -1) return;
    const l = c.finances.loans[idx];

    if (c.finances.bankBalance < l.remainingAmount) {
      alert(language === 'de' ? 'Nicht genug Geld, um den gesamten Kredit abzulösen!' : 'Not enough money to pay off the entire loan!');
      return;
    }

    c.finances.bankBalance -= l.remainingAmount;
    addLogEntry(c, {
      de: `✅ Du hast deinen Kredit über ${l.remainingAmount.toLocaleString()} € vollständig vorzeitig getilgt!`,
      en: `✅ You paid off your loan of ${l.remainingAmount.toLocaleString()} € completely!`
    }, 'good', language);

    c.finances.loans.splice(idx, 1);
    onUpdateCharacter(c);
  };

  const handlePlayCasino = () => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    if (c.finances.bankBalance < casinoBet || casinoBet <= 0) {
      alert(language === 'de' ? 'Nicht genug Geld für diesen Einsatz!' : 'Not enough money for this bet!');
      return;
    }

    c.finances.bankBalance -= casinoBet;
    const rand = Math.random();
    let won = false;
    let multiplier = 0;

    if (casinoChoice === 'green') {
      if (rand < 0.027) { won = true; multiplier = 35; }
    } else {
      if (rand < 0.486) { won = true; multiplier = 2; }
    }

    if (won) {
      const winAmount = casinoBet * multiplier;
      c.finances.bankBalance += winAmount;
      sound.playCoins();
      addLogEntry(c, {
        de: `🎰 CASINO GEWINN! Du hast auf ${casinoChoice} gesetzt und ${winAmount.toLocaleString()} € gewonnen!`,
        en: `🎰 CASINO WIN! You bet on ${casinoChoice} and won ${winAmount.toLocaleString()} €!`
      }, 'good', language);
    } else {
      addLogEntry(c, {
        de: `🎰 Casino Verlust: Die Kugel fiel auf eine andere Farbe. Du hast ${casinoBet.toLocaleString()} € verloren.`,
        en: `🎰 Casino loss: The ball landed on another color. You lost ${casinoBet.toLocaleString()} €.`
      }, 'bad', language);
    }

    onUpdateCharacter(c);
  };

  const handleBuyScratchcard = () => {
    sound.playClick();
    const c = JSON.parse(JSON.stringify(char)) as Character;
    const cost = 10;
    if (c.finances.bankBalance < cost) {
      alert(language === 'de' ? 'Ein Rubbellos kostet 10 €!' : 'A scratchcard costs 10 €!');
      return;
    }
    c.finances.bankBalance -= cost;
    const rand = Math.random();
    let msg = '';
    if (rand > 0.99) {
      const win = 100000;
      c.finances.bankBalance += win;
      sound.playCoins();
      msg = language === 'de' ? `🎉 HAUPTGEWINN! Du hast 100.000 € auf dem Rubbellos freigerubbelt!` : `🎉 JACKPOT! You scratched 100,000 € on the scratchcard!`;
      addLogEntry(c, { de: msg, en: msg }, 'major', language);
    } else if (rand > 0.85) {
      const win = 500;
      c.finances.bankBalance += win;
      sound.playCoins();
      msg = language === 'de' ? `💵 Gewinn: 500 € freigerubbelt!` : `💵 Win: 500 € scratched!`;
      addLogEntry(c, { de: msg, en: msg }, 'good', language);
    } else if (rand > 0.60) {
      const win = 20;
      c.finances.bankBalance += win;
      msg = language === 'de' ? `🎟️ Klein-Gewinn: 20 € gewonnen!` : `🎟️ Small win: 20 € won!`;
    } else {
      msg = language === 'de' ? `❌ Leider eine Niete! Versuchs nochmal.` : `❌ Unfortunately a dud! Try again.`;
    }

    setScratchCardResult(msg);
    onUpdateCharacter(c);
  };

  const totalInvestmentsVal = Object.values(char.finances.investments).reduce((acc, inv) => acc + (inv?.currentValue || 0), 0);
  const totalLoansVal = char.finances.loans.reduce((acc, l) => acc + l.remainingAmount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{language === 'de' ? 'Bankkonto' : 'Bank Balance'}</span>
            <PiggyBank className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-mono font-black text-white truncate">
            {char.country.currencySymbol}{char.finances.bankBalance.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">
            {char.finances.bankBalance < 0 ? (language === 'de' ? '⚠️ Im Minus - Zinsen drohen' : '⚠️ Overdrawn - Interest looms') : (language === 'de' ? 'Verfügbares Barvermögen' : 'Available cash')}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{language === 'de' ? 'Nettovermögen' : 'Net Worth'}</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-mono font-black text-cyan-300 truncate">
            {char.country.currencySymbol}{char.finances.netWorth.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">
            {language === 'de' ? 'Konto + Immobilien + Aktien - Kredite' : 'Cash + Properties + Stocks - Loans'}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>{language === 'de' ? 'Jahresbilanz' : 'Yearly Balance'}</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono font-bold text-emerald-400">+{char.finances.yearlyIncome.toLocaleString()}</span>
            <span className="text-slate-500">/</span>
            <span className="text-sm font-mono font-bold text-rose-400">-{char.finances.yearlyExpenses.toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {language === 'de' ? `Steuern gelöhnt: ~${char.finances.yearlyTaxes.toLocaleString()} €` : `Taxes paid: ~${char.finances.yearlyTaxes.toLocaleString()} €`}
          </p>
        </div>
      </div>

      {/* Grid: Investments & Loans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Investment Market */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>{language === 'de' ? 'Investitionen & Aktienmarkt' : 'Investments & Stock Market'}</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/50">
              {char.country.currencySymbol}{totalInvestmentsVal.toLocaleString()} {language === 'de' ? 'Wert' : 'Value'}
            </span>
          </div>

          {/* Current Portfolio */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase">{language === 'de' ? 'Dein Portfolio:' : 'Your Portfolio:'}</h4>
            {Object.keys(char.finances.investments).length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 text-center text-slate-500 text-xs">
                {language === 'de' ? 'Du hast noch keine Investitionen getätigt.' : 'You hold no investments yet.'}
              </div>
            ) : (
              Object.entries(char.finances.investments).map(([key, inv]) => {
                if (!inv) return null;
                const profit = inv.currentValue - inv.purchasePrice;
                const profitPercent = Math.round((profit / (inv.purchasePrice || 1)) * 100);
                const isPositive = profit >= 0;

                return (
                  <div key={key} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-200 text-sm capitalize">
                        {key === 'stocks' ? (language === 'de' ? 'Aktienmarkt' : 'Stocks') :
                         key === 'crypto' ? (language === 'de' ? 'Krypto (BTC/ETH)' : 'Crypto') :
                         key === 'gold' ? (language === 'de' ? 'Physisches Gold' : 'Gold') :
                         (language === 'de' ? 'Immobilienfonds' : 'Real Estate Fund')}
                      </h5>
                      <p className="text-xs text-slate-400 font-mono">
                        {language === 'de' ? 'Kaufpreis' : 'Bought for'}: {inv.purchasePrice.toLocaleString()} €
                      </p>
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-mono font-extrabold text-white">{inv.currentValue.toLocaleString()} €</p>
                        <span className={`text-[11px] font-mono font-bold flex items-center justify-end space-x-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          <span>{isPositive ? '+' : ''}{profit.toLocaleString()} € ({profitPercent}%)</span>
                        </span>
                      </div>
                      <button
                        onClick={() => handleSellInvestment(key)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-sm shrink-0"
                      >
                        {language === 'de' ? 'Verkaufen' : 'Sell'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Buy Section */}
          <div className="space-y-3 pt-3 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-400 uppercase">{language === 'de' ? 'Neue Investition tätigen:' : 'Make New Investment:'}</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {[
                { id: 'stocks', label: language === 'de' ? '📈 Aktienmarkt (Solide)' : '📈 Stock Market' },
                { id: 'crypto', label: language === 'de' ? '🚀 Krypto (Volatil!)' : '🚀 Crypto (Wild!)' },
                { id: 'gold', label: language === 'de' ? '🥇 Gold & Silber (Sicher)' : '🥇 Gold & Silver' },
                { id: 'real_estate_fund', label: language === 'de' ? '🏢 Immobilienfonds' : '🏢 Real Estate Fund' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { sound.playClick(); setInvestType(t.id as any); }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    investType === t.id
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(Number(e.target.value))}
                step="500"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleBuyInvestment}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20 shrink-0"
              >
                {language === 'de' ? 'Investieren!' : 'Invest Now!'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Bank Loans & Minigames */}
        <div className="space-y-6">
          {/* Bank Loans */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <span>{language === 'de' ? 'Bankkredite & Darlehen' : 'Bank Loans & Credit'}</span>
              </h3>
              <span className="text-xs font-mono font-bold text-rose-400">
                {language === 'de' ? 'Schulden' : 'Debt'}: {char.country.currencySymbol}{totalLoansVal.toLocaleString()}
              </span>
            </div>

            {char.finances.loans.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-900 text-center text-slate-500 text-xs">
                {language === 'de' ? 'Du hast aktuell keine offenen Bankkredite.' : 'You have no active bank loans.'}
              </div>
            ) : (
              <div className="space-y-2">
                {char.finances.loans.map(l => (
                  <div key={l.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-200 font-mono">{l.remainingAmount.toLocaleString()} € {language === 'de' ? 'verbleibend' : 'remaining'}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Rate: {l.yearlyPayment.toLocaleString()} € / Jahr</p>
                    </div>
                    <button
                      onClick={() => handlePayLoan(l.id)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                    >
                      {language === 'de' ? 'Tilgen' : 'Pay Off'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Take new loan */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                step="1000"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleTakeLoan}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-sm shrink-0"
              >
                {language === 'de' ? '+ Kredit aufnehmen' : '+ Take Loan'}
              </button>
            </div>
          </div>

          {/* Minigames: Lottery & Casino */}
          <div className="glass-panel rounded-2xl p-6 border border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-slate-900/80 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-amber-300 font-bold border-b border-amber-500/20 pb-3">
              <Dices className="w-5 h-5" />
              <span>{language === 'de' ? 'Glücksspiel-Lounge: Rubbellose & Casino' : 'Gambling Lounge: Scratchcards & Casino'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Scratchcard */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'de' ? 'Sofort-Rubbellos (10 €)' : 'Instant Scratchcard (€10)'}</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {language === 'de' ? 'Chancen auf bis zu 100.000 € Hauptgewinn!' : 'Chance to win up to €100,000 jackpot!'}
                  </p>
                </div>
                {scratchCardResult && (
                  <p className="text-[11px] font-bold text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/50">
                    {scratchCardResult}
                  </p>
                )}
                <button
                  onClick={handleBuyScratchcard}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all shadow-md"
                >
                  🎟️ {language === 'de' ? 'Rubbellos kaufen & rubbeln!' : 'Buy & Scratch Card!'}
                </button>
              </div>

              {/* Casino Roulette */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1">
                    <RefreshCw className="w-3.5 h-3.5 text-rose-400 animate-spin-slow" />
                    <span>{language === 'de' ? 'Roulette - Farbenspiel' : 'Roulette - Color Bet'}</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    {[
                      { id: 'red', label: 'Rot (2x)', bg: 'bg-rose-600 hover:bg-rose-500 text-white' },
                      { id: 'black', label: 'Schwarz (2x)', bg: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600' },
                      { id: 'green', label: '0 Grün (35x)', bg: 'bg-emerald-600 hover:bg-emerald-500 text-white' }
                    ].map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => { sound.playClick(); setCasinoChoice(c.id as any); }}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all ${c.bg} ${casinoChoice === c.id ? 'ring-2 ring-white scale-105' : 'opacity-70'}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-1 pt-1">
                  <input
                    type="number"
                    value={casinoBet}
                    onChange={(e) => setCasinoBet(Number(e.target.value))}
                    step="50"
                    className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-slate-100"
                  />
                  <button
                    onClick={handlePlayCasino}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
                  >
                    🎰 {language === 'de' ? 'Drehen!' : 'Spin!'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
