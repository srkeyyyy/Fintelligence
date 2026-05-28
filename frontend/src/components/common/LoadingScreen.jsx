import CurrencyLoader from "./CurrencyLoader";

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#0f172a] text-white">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-4">
        <CurrencyLoader message="Opening Fintelligence" />
      </div>
    </div>
  );
}

export default LoadingScreen;
