const Skill = require('../models/Skill');
const axios = require('axios');
require('dotenv').config();

// Get summary from OpenAI (single attempt only)
async function fetchSummary(name) {
  const prompt = `Give me a short paragraph summary (2-3 sentences) explaining what the skill "${name}" is and why it's useful.`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo-0125', // more stable model
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 60,
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
}

// Get all skills
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    console.error('❌ Failed to get skills:', error);
    res.status(500).json({ message: 'Error retrieving skills' });
  }
};

// Add a new skill (no retry)
exports.addSkill = async (req, res) => {
  try {
    const { name, category, icon } = req.body;

    // Prevent duplicates
    const exists = await Skill.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Skill already exists' });

    // Generate AI summary (single request only)
    const summary = await fetchSummary(name);

    const skill = new Skill({ name, category, icon, summary });
    await skill.save();

    res.status(201).json(skill);
  } catch (err) {
    console.error('❌ Error adding skill:', err.response?.data || err.message);
    res.status(500).json({ message: 'Error adding skill', error: err.message });
  }
};
