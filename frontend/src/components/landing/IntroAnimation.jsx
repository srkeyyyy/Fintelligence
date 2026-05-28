import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Banknote, Coins, CreditCard, LogIn, Sparkles, UserPlus, WalletCards } from "lucide-react";

const floatItems = [
  { icon: Banknote, label: "Save", x: "-30vw", y: "-18vh", delay: 0.2, color: "text-teal-300" },
  { icon: Coins, label: "Plan", x: "28vw", y: "-12vh", delay: 0.35, color: "text-yellow-300" },
  { icon: CreditCard, label: "Track", x: "-24vw", y: "18vh", delay: 0.5, color: "text-sky-300" },
  { icon: WalletCards, label: "Grow", x: "24vw", y: "18vh", delay: 0.65, color: "text-teal-200" },
];

function IntroAnimation() {
  return (
    <div className="relative grid min-h-[calc(100vh-4rem)] place-items-center overflow-hidden rounded-lg border border-white/10 bg-[#172033] px-5 py-10">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(20,184,166,0.2),transparent_30%),radial-gradient(circle_at_15%_75%,rgba(250,204,21,0.12),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(56,189,248,0.12),transparent_26%)]"
        initial={{ opacity: 0, scale: 1.08 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <motion.svg
        aria-hidden="true"
        className="absolute h-[62vmin] max-h-[620px] min-h-[360px] w-[62vmin] max-w-[620px] min-w-[360px]"
        fill="none"
        viewBox="0 0 600 600"
      >
        <motion.circle
          cx="300"
          cy="300"
          r="210"
          stroke="rgba(250,204,21,0.18)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, rotate: -30 }}
          animate={{ pathLength: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M132 337C181 207 274 169 369 216C449 256 487 338 433 401C374 471 240 455 185 379"
          stroke="rgba(20,184,166,0.72)"
          strokeLinecap="round"
          strokeWidth="8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.45, delay: 0.25, ease: "easeInOut" }}
        />
        <motion.path
          d="M165 268C216 329 277 345 350 290C386 263 429 265 466 300"
          stroke="rgba(56,189,248,0.56)"
          strokeLinecap="round"
          strokeWidth="5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.55, ease: "easeInOut" }}
        />
      </motion.svg>

      {floatItems.map(({ icon: Icon, label, x, y, delay, color }) => (
        <motion.div
          animate={{ opacity: 1, x, y }}
          className="absolute hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm text-slate-100 shadow-2xl backdrop-blur md:flex"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.76 }}
          key={label}
          transition={{ delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.06, y: `calc(${y} - 4px)` }}
        >
          <Icon className={color} size={18} />
          {label}
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.14, delayChildren: 0.95 } },
        }}
      >
        <motion.div
          className="mb-6 grid h-20 w-20 place-items-center rounded-2xl border border-teal-300/25 bg-teal-400/12 text-teal-300 shadow-2xl"
          variants={{
            hidden: { opacity: 0, scale: 0.72, rotate: -10 },
            show: { opacity: 1, scale: 1, rotate: 0 },
          }}
          transition={{ type: "spring", stiffness: 170, damping: 14 }}
          whileHover={{ scale: 1.08, rotate: 3 }}
        >
          <Sparkles size={34} />
        </motion.div>

        <motion.p
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium text-slate-300"
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <span className="h-2 w-2 rounded-full bg-yellow-300" />
          Finance Made Simple
        </motion.p>

        <motion.h1
          className="text-6xl font-bold leading-tight tracking-normal text-white md:text-8xl"
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(12px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Fintelligence
        </motion.h1>

        <motion.p
          className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-300"
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0 },
          }}
        >
          Track Spending, Plan Better, And Feel More In Control.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap justify-center gap-3"
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/auth?mode=signup"
              className="premium-action inline-flex items-center gap-2 rounded-lg px-5 py-3 font-bold text-slate-950 transition"
            >
              <UserPlus size={18} />
              Sign Up
              <ArrowRight size={18} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/auth?mode=login"
              className="premium-ghost inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.05] px-5 py-3 font-bold text-white transition"
            >
              <LogIn size={18} />
              Log In
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default IntroAnimation;
