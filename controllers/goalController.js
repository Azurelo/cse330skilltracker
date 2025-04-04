const Goal = require('../models/Goal');

// Get all goals for logged-in user
exports.getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving goals' });
    }
};

// Create a new goal
exports.createGoal = async (req, res) => {
    try {
        const { title, description, resources } = req.body;
        const newGoal = new Goal({ 
            user: req.user.id, 
            title, 
            description, 
            resources: resources || [] 
        });

        await newGoal.save();
        res.status(201).json(newGoal);
    } catch (error) {
        res.status(500).json({ message: 'Error creating goal' });
    }
};

// Update a goal (title, description, progress, resources, or completion status)
exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal || goal.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        goal.title = req.body.title || goal.title;
        goal.description = req.body.description || goal.description;
        goal.progress = req.body.progress !== undefined ? req.body.progress : goal.progress;
        goal.completed = req.body.completed !== undefined ? req.body.completed : goal.completed;

        if (req.body.resources) {
            goal.resources = req.body.resources; // Replace resources array
        }

        await goal.save();
        res.json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Error updating goal' });
    }
};

// Delete a goal
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
