const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

module.exports = {
  generateTripPlan,
};