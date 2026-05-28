import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, CircleDollarSign, CreditCard, Landmark } from "lucide-react";

import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

function Auth() {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState(initialMode);
  const isLogin = mode === "login";

  const copy = useMemo(
    () =>
      isLogin
        ? {
            title: "Welcome Back",
            subtitle: "Continue To Your Financial Workspace.",
          }
        : {
            title: "Create Your Account",
            subtitle: "Set Up Your Workspace In A Few Quick Steps.",
          },
    [isLogin]
  );

  return (
    <main className="grid min-h-screen place-items-center bg-[#0f172a] px-5 py-8 text-white">
      <Toaster position="top-center" />
      <div className="w-full max-w-5xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft size={16} />
          Back To Intro
        </Link>

        <div className="grid overflow-hidden rounded-lg border border-white/10 bg-[#172033] shadow-2xl md:grid-cols-[0.85fr_1.15fr]">
          <section className="relative hidden min-h-[620px] overflow-hidden bg-[#1e293b] p-8 md:grid md:place-items-center">
            <motion.div
              animate={{ rotate: 360 }}
              className="absolute h-80 w-80 rounded-full border border-teal-300/15"
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              className="absolute h-56 w-56 rounded-full border border-yellow-300/15"
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="relative grid h-44 w-44 place-items-center rounded-[32px] border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur"
              initial={{ opacity: 0, scale: 0.82, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
            >
              <Landmark className="text-yellow-300" size={56} />
            </motion.div>
            {[CircleDollarSign, CreditCard, Landmark].map((Icon, index) => (
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  opacity: [0.65, 1, 0.65],
                }}
                className="absolute grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-[#172033] text-teal-300 shadow-xl"
                key={index}
                style={{
                  left: `${24 + index * 22}%`,
                  top: `${24 + (index % 2) * 42}%`,
                }}
                transition={{ duration: 2.8 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon size={24} />
              </motion.div>
            ))}
          </section>

          <section className="p-5 sm:p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold">{copy.title}</h2>
              <p className="mt-2 text-slate-300">{copy.subtitle}</p>
            </div>

            <div className="relative mb-8 grid grid-cols-2 rounded-lg border border-white/10 bg-black/20 p-1">
              <span
                className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-md bg-teal-400 shadow-lg shadow-teal-400/20 transition-transform duration-300 ${
                  isLogin ? "translate-x-0" : "translate-x-full"
                }`}
              />
          <button
                onClick={() => setMode("login")}
                className={`relative rounded-md px-4 py-3 font-semibold transition ${isLogin ? "text-slate-950" : "text-slate-300"}`}
                type="button"
          >
            Log In
          </button>

          <button
                onClick={() => setMode("signup")}
                className={`relative rounded-md px-4 py-3 font-semibold transition ${!isLogin ? "text-slate-950" : "text-slate-300"}`}
                type="button"
          >
            Sign Up
          </button>
        </div>

            {isLogin ? <LoginForm /> : <SignupForm />}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Auth;
