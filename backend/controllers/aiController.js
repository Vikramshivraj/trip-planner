const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MAX_TRIP_DAYS = 30;
const DESTINATION_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s,.'-]{1,59}$/;
const UNSUPPORTED_DESTINATIONS = new Set(["mars", "moon", "jupiter", "saturn", "venus", "mercury", "uranus", "neptune", "pluto"]);

const validateAITripInput = ({ destination, budget, days, travelType }) => {
  const cleanDestination = typeof destination === "string" ? destination.trim() : "";
  const numericBudget = Number(budget);
  const numericDays = Number(days);
  const allowedTravelTypes = ["Solo", "Friends", "Family", "Couple"];

  if (!DESTINATION_REGEX.test(cleanDestination)) {
    return "Enter a valid destination using letters (for example: Goa or New Delhi).";
  }

  if (UNSUPPORTED_DESTINATIONS.has(cleanDestination.toLowerCase())) {
    return "Please enter a real-world destination on Earth.";
  }

  if (!Number.isFinite(numericBudget) || numericBudget <= 0 || numericBudget > 100000000) {
    return "Budget must be greater than 0 and within a reasonable range.";
  }

  if (!Number.isInteger(numericDays) || numericDays < 1 || numericDays > MAX_TRIP_DAYS) {
    return `Trip duration must be between 1 and ${MAX_TRIP_DAYS} days.`;
  }

  if (!allowedTravelTypes.includes(travelType)) {
    return "Invalid travel type.";
  }

  return null;
};


const generateTripPlan = async (req, res) => {
      console.log("AI API HIT");
  console.log(req.body);

  try {

    const {
      destination,
      budget,
      days,
      travelType,
    } = req.body;

    const validationError = validateAITripInput({ destination, budget, days, travelType });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const model = genAI.getGenerativeModel({
       model: "models/gemini-3.5-flash",
    });

    const prompt = `
You are an expert travel planner.

Create a professional travel itinerary.

Destination : ${destination}

Budget : ₹${budget}

Duration : ${days} days

Travel Type : ${travelType}

Return response ONLY in markdown.

Format:

# Trip Summary

Destination

Budget

Duration

---

# Day 1

Morning

Afternoon

Evening

Night

Estimated Cost

---

# Day 2

same

---

# Recommended Hotels

Hotel Name

Approx Cost

Rating

---

# Food Recommendations

Breakfast

Lunch

Dinner

---

# Estimated Budget Breakdown

Table

---

# Travel Tips

---

# Things To Carry

---

# Emergency Contacts

---

Make response attractive.

Do not use JSON.

Use markdown headings.

Do not write unnecessary introduction.
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    res.json({
      plan: response,
    });

  }  catch (error) {

  console.log("========= GEMINI ERROR =========");
  console.log(error);
  console.log(error.message);

  if (error.response) {
    console.log(error.response.data);
  }

  res.status(500).json({
    message: error.message,
  });

}

};

const chatWithAssistant = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "models/gemini-3.5-flash" });
    const recentHistory = history
      .slice(-8)
      .map((item) => `${item.role === "user" ? "User" : "Assistant"}: ${item.text}`)
      .join("\n");

    const prompt = `You are a concise, practical AI travel assistant inside a Travel & Expense Planner app.
Help with itineraries, destinations, transport, hotels, food, packing, budgets and travel planning.
Use markdown when useful. Keep answers actionable. Do not invent live prices, availability, weather, or opening hours; tell the user when current information should be checked.

Recent conversation:\n${recentHistory}\n\nUser: ${message}\nAssistant:`;

    const result = await model.generateContent(prompt);
    return res.json({ reply: result.response.text() });
  } catch (error) {
    console.log("========= GEMINI CHAT ERROR =========");
    console.log(error.message);
    return res.status(500).json({ message: error.message || "AI chat failed" });
  }
};

module.exports = {
  generateTripPlan,
  chatWithAssistant,
};