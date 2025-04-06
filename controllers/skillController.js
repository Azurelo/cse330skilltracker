const Skill = require('../models/Skill');

// Get all skills
exports.getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving skills' });
    }
};

// Create a skill
exports.addSkill = async (req, res) => {
    try {
        const { name, category, icon } = req.body;

        // Optional: prevent duplicates
        const existing = await Skill.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: 'Skill already exists' });
        }

        const newSkill = new Skill({ name, category, icon });
        await newSkill.save();

        res.status(201).json(newSkill);
    } catch (error) {
        res.status(500).json({ message: 'Error adding skill' });
    }
};
