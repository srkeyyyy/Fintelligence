import { useEffect, useMemo, useRef, useState } from "react";
import { ImageUp, Plus, ReceiptText, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { createTransaction, deleteTransaction, getTransactions } from "../../services/transaction.service";
import { extractReceipt } from "../../services/ai.service";
import CurrencyLoader from "../common/CurrencyLoader";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);

const emptyForm = {
  amount: "",
  category: "",
  date: "",
  description: "",
  merchant: "",
  type: "expense",
};

function TransactionSection() {
  const [transactions, setTransactions] = useState([]);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [receiptNote, setReceiptNote] = useState("");
  const [highlightedFields, setHighlightedFields] = useState([]);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState(emptyForm);
  const highlightTimer = useRef(null);

  const loadTransactions = () =>
    getTransactions()
      .then(setTransactions)
      .finally(() => setTransactionsLoading(false));

  useEffect(() => {
    loadTransactions().catch(() => toast.error("Unable to load transactions"));

    return () => {
      window.clearTimeout(highlightTimer.current);
    };
  }, []);

  const filteredTotals = useMemo(
    () =>
      transactions.reduce(
        (totals, transaction) => ({
          ...totals,
          [transaction.type]: totals[transaction.type] + transaction.amount,
        }),
        { expense: 0, income: 0 }
      ),
    [transactions]
  );

  const updateForm = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setHighlightedFields((current) => current.filter((field) => field !== event.target.name));
  };

  const submitTransaction = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await createTransaction(form);
      toast.success("Transaction added");
      setForm(emptyForm);
      setReceiptNote("");
      setHighlightedFields([]);
      setPreview("");
      setTransactionsLoading(true);
      await loadTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add transaction");
    } finally {
      setSaving(false);
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const scanReceipt = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPreview(URL.createObjectURL(file));
    setReceiptLoading(true);
    setReceiptNote("");
    setHighlightedFields([]);

    try {
      const imageBase64 = await fileToBase64(file);
      const data = await extractReceipt({
        imageBase64,
        mimeType: file.type,
      });
      const receipt = data.receipt;
      const nextFields = {};

      ["amount", "category", "date", "description", "merchant", "type"].forEach((field) => {
        if (receipt[field] !== null && receipt[field] !== undefined && receipt[field] !== "") {
          nextFields[field] = String(receipt[field]);
        }
      });

      setForm((current) => ({ ...current, ...nextFields }));

      const needsReview = ["amount", "category", "date"]
        .filter((field) => !nextFields[field])
        .concat(receipt.missingFields || [])
        .filter((field, index, fields) => fields.indexOf(field) === index);

      if (needsReview.length > 0) {
        setHighlightedFields(needsReview);
        setReceiptNote(`Needs to be filled: ${needsReview.join(", ")}.`);
        window.clearTimeout(highlightTimer.current);
        highlightTimer.current = window.setTimeout(() => {
          setHighlightedFields([]);
        }, 60000);
      } else {
        setReceiptNote("Details extracted. Please review before saving.");
      }

      toast.success("Info extracted. Review the detected fields.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not analyze the receipt image");
    } finally {
      setReceiptLoading(false);
      event.target.value = "";
    }
  };

  const fieldClass = (name, baseClass) =>
    `${baseClass} ${
      highlightedFields.includes(name)
        ? "missing-field-highlight border-amber-300/80 bg-amber-300/10"
        : "border-white/10 bg-white/[0.06]"
    }`;

  const removeTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted");
      setTransactionsLoading(true);
      await loadTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete transaction");
    }
  };

  return (
    <section className="section-slide grid gap-5 xl:grid-cols-[420px_1fr]">
      <div className="space-y-5">
        <form className="rounded-lg border border-white/10 bg-white/[0.04] p-5" onSubmit={submitTransaction}>
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-400/15 text-sky-300">
              <ReceiptText size={20} />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Add transaction</h2>
              <p className="text-sm text-slate-400">Enter manually or scan a receipt</p>
            </div>
          </div>

          <label className="mb-4 grid cursor-pointer place-items-center rounded-lg border border-dashed border-white/20 bg-black/15 p-5 text-center hover:bg-white/[0.04]">
            <ImageUp className="mb-2 text-teal-300" size={28} />
            {receiptLoading ? (
              <CurrencyLoader compact message="Extracting info" />
            ) : (
              <>
                <span className="text-sm font-medium">Upload receipt image</span>
                <span className="mt-1 text-xs text-slate-400">Only visible details will be filled</span>
              </>
            )}
            <input accept="image/*" className="hidden" disabled={receiptLoading} onChange={scanReceipt} type="file" />
          </label>

          {preview && <img alt="Receipt preview" className="mb-4 max-h-52 w-full rounded-lg object-cover" src={preview} />}
          {receiptNote && <p className="mb-4 rounded-lg border border-teal-300/20 bg-teal-400/10 p-3 text-sm text-teal-100">{receiptNote}</p>}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <select
                className="rounded-lg border border-white/10 bg-[#1e293b] px-3 py-3 outline-none"
                name="type"
                onChange={updateForm}
                value={form.type}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input
                className={fieldClass("amount", "rounded-lg border px-3 py-3 outline-none transition")}
                min="1"
                name="amount"
                onChange={updateForm}
                placeholder="Amount"
                required
                type="number"
                value={form.amount}
              />
            </div>
            <input
              className={fieldClass("merchant", "w-full rounded-lg border px-3 py-3 outline-none transition")}
              name="merchant"
              onChange={updateForm}
              placeholder="Merchant"
              value={form.merchant}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className={fieldClass("category", "rounded-lg border px-3 py-3 outline-none transition")}
                name="category"
                onChange={updateForm}
                placeholder="Category"
                required
                value={form.category}
              />
              <input
                className={fieldClass("date", "rounded-lg border px-3 py-3 outline-none transition")}
                name="date"
                onChange={updateForm}
                required
                type="date"
                value={form.date}
              />
            </div>
            <textarea
              className={fieldClass("description", "min-h-24 w-full rounded-lg border px-3 py-3 outline-none transition")}
              name="description"
              onChange={updateForm}
              placeholder="Description"
              value={form.description}
            />
            <button
              className="premium-action inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={saving}
              type="submit"
            >
              {saving ? <CurrencyLoader compact /> : <Plus size={18} />}
              {saving ? "Saving" : "Save transaction"}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm text-slate-400">Income</p>
            <p className="mt-2 text-xl font-semibold text-teal-300">{formatCurrency(filteredTotals.income)}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm text-slate-400">Expense</p>
            <p className="mt-2 text-xl font-semibold text-rose-300">{formatCurrency(filteredTotals.expense)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <span className="text-sm text-slate-400">{transactionsLoading ? "" : `${transactions.length} records`}</span>
        </div>

        {transactionsLoading ? (
          <div className="grid min-h-[360px] place-items-center">
            <CurrencyLoader message="Fetching transactions" />
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-y-2 text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Merchant</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 text-right font-medium">Amount</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="bg-white/[0.04]">
                  <td className="rounded-l-lg px-3 py-3">{transaction.merchant || transaction.description || "Untitled"}</td>
                  <td className="px-3 py-3 text-slate-300">{transaction.category}</td>
                  <td className="px-3 py-3 text-slate-300">{new Date(transaction.date).toLocaleDateString("en-IN")}</td>
                  <td className="px-3 py-3">
                    <span className={transaction.type === "income" ? "text-teal-300" : "text-rose-300"}>{transaction.type}</span>
                  </td>
                  <td className="px-3 py-3 text-right font-semibold">{formatCurrency(transaction.amount)}</td>
                  <td className="rounded-r-lg px-3 py-3 text-right">
                    <button
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/[0.06]"
                      onClick={() => removeTransaction(transaction.id)}
                      title="Delete transaction"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </section>
  );
}

export default TransactionSection;
