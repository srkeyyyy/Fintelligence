import { useEffect, useState } from "react";

const currencies = ["$", "\u20ac", "\u00a3", "\u00a5", "\u20b9", "\u20bf", "\u20a9", "\u20ba"];

function CurrencyLoader({ compact = false, message = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % currencies.length);
    }, 400);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center ${compact ? "gap-2 p-1" : "gap-4 p-8"}`}>
      <div className={`relative grid place-items-center ${compact ? "h-10 w-10" : "h-20 w-20"}`}>
        <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-teal-300 currency-spin" />
        <span className={`${compact ? "text-lg" : "text-3xl"} font-bold text-teal-300 currency-symbol`}>
          {currencies[currentIndex]}
        </span>
      </div>
      {message && <p className="text-center text-sm font-medium text-slate-400">{message}</p>}
    </div>
  );
}

export default CurrencyLoader;
