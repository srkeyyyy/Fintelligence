import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import CurrencyLoader from "../common/CurrencyLoader";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast.success("Welcome Back");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 section-slide" onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-sm text-slate-300">Email</span>
        <input
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition focus:border-teal-300/60"
          name="email"
          onChange={updateForm}
          placeholder="you@example.com"
          required
          type="email"
          value={form.email}
        />
      </label>
      <label className="block">
        <span className="text-sm text-slate-300">Password</span>
        <input
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition focus:border-teal-300/60"
          name="password"
          onChange={updateForm}
          placeholder="Enter Your Password"
          required
          type="password"
          value={form.password}
        />
      </label>
      <button
        className="premium-action inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? <CurrencyLoader compact /> : <LogIn size={18} />}
        {loading ? "Signing In" : "Log In"}
      </button>
    </form>
  );
}

export default LoginForm;
