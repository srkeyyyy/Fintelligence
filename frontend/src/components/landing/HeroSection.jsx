import IntroAnimation from "./IntroAnimation";

function HeroSection() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0f172a] text-white">
      <section className="mx-auto min-h-screen max-w-7xl px-5 py-8 md:px-8">
        <IntroAnimation />
      </section>
    </main>
  );
}

export default HeroSection;
