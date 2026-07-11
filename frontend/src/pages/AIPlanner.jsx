import { useState } from "react";

import API from "../api/api";
import ReactMarkdown from "react-markdown";

const AIPlanner = () => {

  const [loading, setLoading] = useState(false);

  const [plan, setPlan] = useState("");

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

  const generatePlan = async () => {

    try {

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

      alert("Failed to generate plan");

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-black text-white flex justify-center items-center p-6">

      <div className="w-full max-w-3xl bg-zinc-900 rounded-3xl p-8">

        <h1 className="text-4xl font-bold mb-6">
          ✨ AI Trip Planner
        </h1>

        <div className="space-y-4">

          <input
            type="text"
            name="destination"
            placeholder="Destination"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-800"
          />

          <input
            type="number"
            name="budget"
            placeholder="Budget"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-zinc-800"
          />

          <input
            type="number"
            name="days"
            placeholder="Number of Days"
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

          <button
            onClick={generatePlan}
            className="w-full bg-purple-600 p-4 rounded-xl"
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