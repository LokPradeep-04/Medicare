const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const conversationHistory = {};

const chat = async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id.toString();

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const hospitalName = process.env.HOSPITAL_NAME || "MediCare Hospital";

    const systemPrompt = `You are a helpful hospital assistant for ${hospitalName}.

HOSPITAL INFO:
- Name: ${hospitalName}
- Hours: Monday to Saturday 8AM to 8PM
- Emergency: 24/7

DEPARTMENTS:
Cardiology, Neurology, Orthopedics, Pediatrics, General Medicine, Dental, Ophthalmology, Dermatology, ENT, Gynecology

YOU HELP PATIENTS WITH:
- Symptom guidance → suggest which department to visit
- Doctor recommendations based on symptoms
- Hospital information → timings, departments, emergency
- Appointment booking help → guide them to use the booking system

RESPONSE RULES:
- Only answer questions related to this hospital
- Never diagnose diseases
- Always suggest seeing a doctor for serious concerns
- Keep responses short and clear (2-3 sentences)
- Be empathetic and professional
- Never use markdown like ** or ## in responses
- If unrelated question politely say you can only help with hospital related questions`;

    if (!conversationHistory[userId]) {
      conversationHistory[userId] = [];
    }

    conversationHistory[userId].push({
      role: "user",
      parts: [{ text: message.trim() }]
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    });

    const chatSession = model.startChat({
      history: conversationHistory[userId].slice(0, -1)
    });

    const result = await chatSession.sendMessage(message.trim());
    const reply = result.response.text();

    conversationHistory[userId].push({
      role: "model",
      parts: [{ text: reply }]
    });

    if (conversationHistory[userId].length > 20) {
      conversationHistory[userId] = conversationHistory[userId].slice(-20);
    }

    res.status(200).json({ reply });

  } catch (error) {
    console.log("Chat error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

module.exports = { chat };
