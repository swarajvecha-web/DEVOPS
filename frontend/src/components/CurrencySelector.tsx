import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useCurrencyStore } from '../store/currencyStore';
import { CURRENCIES } from '../types';

const CurrencySelector = () => {
  const { selectedCurrency, setCurrency } = useCurrencyStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl relative z-50"
      >
        <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <span className="font-semibold text-gray-900 dark:text-white">
          {selectedCurrency.symbol} {selectedCurrency.code}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[40]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-[50] overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Select Currency
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-hide">
              {CURRENCIES.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setCurrency(currency);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200 flex items-center justify-between ${
                    selectedCurrency.code === currency.code
                      ? 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border-l-4 border-indigo-500'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {currency.symbol}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {currency.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {currency.code}
                      </div>
                    </div>
                  </div>
                  {selectedCurrency.code === currency.code && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencySelector;

