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
        const { name } = req.body;
        const newSkill = new Skill({ user: req.user.id, name });

        await newSkill.save();
        res.status(201).json(newSkill);
    } catch (error) {
        res.status(500).json({ message: 'Error adding skill' });
    }
};
