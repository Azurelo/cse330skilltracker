// controllers/goalController.js
const Goal = require('../models/Goal');
const Skill = require('../models/Skill');

// Get all goals for logged-in user
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id }).populate('skills');
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving goals' });
    }
};

// Add a skill to user goals
exports.addSkillToUser = async (req, res) => {
    const { skillId } = req.body;
    try {
        const skill = await Skill.findById(skillId);
        if (!skill) return res.status(404).json({ message: 'Skill not found' });

        const existingGoal = await Goal.findOne({ user: req.user.id, title: skill.name });
        if (existingGoal) return res.status(400).json({ message: 'Skill already added' });

        const newGoal = new Goal({
            user: req.user.id,
            title: skill.name,
            description: `Learning ${skill.name}`,
            skills: [skill._id],
            resources: [],
            progress: 0
        });

        await newGoal.save();
        res.status(201).json(newGoal);
    } catch (err) {
        res.status(500).json({ message: 'Error adding skill to user' });
    }
};

// Delete a skill/goal
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal || goal.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await goal.deleteOne();
        res.json({ message: 'Goal deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting goal' });
    }
};

// Update goal progress or resources
exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal || goal.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        goal.progress = req.body.progress ?? goal.progress;
        goal.completed = req.body.completed ?? goal.completed;
        goal.resources = req.body.resources ?? goal.resources;

        await goal.save();
        res.json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Error updating goal' });
    }
};
