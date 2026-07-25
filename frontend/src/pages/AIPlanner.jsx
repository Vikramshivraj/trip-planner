import { useState } from "react";

import API from "../api/api";
import ReactMarkdown from "react-markdown";
import { FaDownload, FaMagic } from "react-icons/fa";

const AIPlanner = () => {

  const [loading, setLoading] = useState(false);

  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    destination: "",
    budget: "",
    days: "",
    travelType: "Solo",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const validateForm = () => {
    const destination = formData.destination.trim();
    const destinationRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s,.'-]{1,59}$/;
    const unsupported = ["mars", "moon", "jupiter", "saturn", "venus", "mercury", "uranus", "neptune", "pluto"];
    const budget = Number(formData.budget);
    const days = Number(formData.days);

    if (!destinationRegex.test(destination)) return "Enter a valid destination, for example Goa or New Delhi.";
    if (unsupported.includes(destination.toLowerCase())) return "Please enter a real-world destination on Earth.";
    if (!Number.isFinite(budget) || budget <= 0 || budget > 100000000) return "Enter a valid positive budget.";
    if (!Number.isInteger(days) || days < 1 || days > 30) return "Trip duration must be between 1 and 30 days.";
    return "";
  };

  const generatePlan = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/ai/generate",
        formData,
        {
          headers: {
            authorization: token,
          },
        }
      );

      setPlan(res.data.plan);

    } catch (error) {
      setError(error.response?.data?.message || "Failed to generate plan");

    }

    setLoading(false);

  };


  const downloadPlan = () => {
    if (!plan) return;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      alert("Please allow pop-ups to download the itinerary");
      return;
    }

    const safeText = plan
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    printWindow.document.write(`<!doctype html><html><head><title>${formData.destination || "Trip"} Itinerary</title><style>body{font-family:Arial,sans-serif;max-width:820px;margin:40px auto;padding:0 24px;color:#18181b;line-height:1.6}h1{margin-bottom:4px}.meta{color:#52525b;margin-bottom:28px}.plan{white-space:pre-wrap;font-family:Arial,sans-serif}@media print{button{display:none}}</style></head><body><h1>${formData.destination || "AI Trip"} Itinerary</h1><div class="meta">Budget: ₹${formData.budget || "-"} · ${formData.days || "-"} days · ${formData.travelType}</div><div class="plan">${safeText}</div><script>window.onload=()=>window.print()<\/script></body></html>`);
    printWindow.document.close();
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-violet-950 text-white flex justify-center items-start p-6 md:p-10">

      <div className="w-full max-w-4xl bg-zinc-900/80 border border-zinc-800 backdrop-blur rounded-3xl p-6 md:p-8 shadow-2xl">

        <h1 className="text-4xl font-bold mb-6">
          <span className="inline-flex items-center gap-3"><FaMagic className="text-violet-400" /> AI Trip Planner</span>
        </h1>

        <div className="space-y-4">

          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            maxLength={60}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-800"
          />

          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            min="1"
            max="100000000"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-800"
          />

          <input
            type="number"
            name="days"
            placeholder="Number of Days"
            value={formData.days}
            min="1"
            max="30"
            step="1"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-800"
          />

          <select
            name="travelType"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-800"
          >

            <option>Solo</option>

            <option>Friends</option>

            <option>Family</option>

            <option>Couple</option>

          </select>

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            onClick={generatePlan}
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition p-4 rounded-xl font-semibold disabled:opacity-60"
          >

            {

              loading

              ?

              "Generating..."

              :

              "Generate AI Plan"

            }

          </button>

        </div>

        {

          plan && (

            <div className="
mt-8
bg-white
text-black
rounded-2xl
shadow-xl
p-8
prose
prose-lg
max-w-none
">

              <div className="mb-6 flex justify-end">
                <button onClick={downloadPlan} className="not-prose inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700">
                  <FaDownload /> Download / Save PDF
                </button>
              </div>
              <ReactMarkdown>
                {plan}
              </ReactMarkdown>

            </div>

          )

        }

      </div>

    </div>

  );

};

export default AIPlanner;