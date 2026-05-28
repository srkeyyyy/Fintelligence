import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import CurrencyLoader from "../common/CurrencyLoader";

function SignUpForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await signup(form);
      toast.success("Account created");
      navigate("/budget-setup");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 section-slide" onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-sm text-slate-300">Full Name</span>
        <input
          className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition focus:border-teal-300/60"
          name="name"
          onChange={updateForm}
          placeholder="Aarav Sharma"
          required
          value={form.name}
        />
      </label>
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
          minLength={6}
          name="password"
          onChange={updateForm}
          placeholder="Minimum 6 Characters"
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
        {loading ? <CurrencyLoader compact /> : <UserPlus size={18} />}
        {loading ? "Creating Account" : "Sign Up"}
      </button>
    </form>
  );
}

export default SignUpForm;
